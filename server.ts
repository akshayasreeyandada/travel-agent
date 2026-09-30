import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_N8N_URL = 'https://aki13.app.n8n.cloud/form/0b90a488-efdf-4886-ab7d-2cbef9292b53';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Integration diagnostic info
  app.get('/api/n8n-info', (req, res) => {
    res.json({
      configuredUrl: DEFAULT_N8N_URL,
      title: 'TRAVEL AGENT',
      subtitle: 'We will plan your entire trip',
      status: 'active',
      fields: [
        { id: 'field-0', label: 'Name', required: true, type: 'text' },
        { id: 'field-1', label: 'Email', required: true, type: 'email' },
        { id: 'field-2', label: 'Destination', required: true, type: 'text' },
        { id: 'field-3', label: 'Departure city', required: true, type: 'text' },
        { id: 'field-4', label: 'Start date', required: true, type: 'date' },
        { id: 'field-5', label: 'End date', required: true, type: 'date' },
        { id: 'field-6', label: 'Number of travelers', required: true, type: 'number' },
        { id: 'field-7', label: 'Total Budget', required: true, type: 'number' },
        {
          id: 'field-8',
          label: 'Currency',
          required: true,
          type: 'select',
          options: ['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)'],
        },
        {
          id: 'field-9',
          label: 'Travel style',
          required: true,
          type: 'select',
          options: ['Budget', 'Standard', 'Premium', 'Luxury'],
        },
        {
          id: 'field-10',
          label: 'Accomodation type',
          required: true,
          type: 'select',
          options: ['Budget Hotel', '3-Star Hotel', '4-Star Hotel', '5-Star Hotel'],
        },
        {
          id: 'field-11',
          label: 'Food Preference',
          required: true,
          type: 'multiselect',
          options: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'No Preference'],
        },
        {
          id: 'field-12',
          label: 'Transportation Preference',
          required: false,
          type: 'multiselect',
          options: ['Flights', 'Train', 'Bus', 'Public Transport', 'Rental Car'],
        },
      ],
    });
  });

  // Verify connection to the n8n form endpoint
  app.get('/api/ping-n8n', async (req, res) => {
    try {
      const url = typeof req.query.url === 'string' && req.query.url ? req.query.url : DEFAULT_N8N_URL;
      const response = await fetch(url, { method: 'GET' });
      const statusText = response.statusText || 'OK';
      res.json({
        ok: response.status >= 200 && response.status < 400,
        status: response.status,
        statusText,
        url,
      });
    } catch (err: any) {
      res.status(500).json({
        ok: false,
        error: err.message || 'Could not ping n8n form endpoint',
      });
    }
  });

  // Proxy endpoint for n8n form submission
  app.post('/api/submit-trip', async (req, res) => {
    try {
      const {
        name,
        email,
        destination,
        departureCity,
        startDate,
        endDate,
        travelers,
        budget,
        currency,
        travelStyle,
        accommodationType,
        foodPreferences,
        transportationPreferences,
        customWebhookUrl,
      } = req.body;

      // Validation
      if (
        !name ||
        !email ||
        !destination ||
        !departureCity ||
        !startDate ||
        !endDate ||
        !travelers ||
        !budget ||
        !currency ||
        !travelStyle ||
        !accommodationType
      ) {
        return res.status(400).json({
          error: 'Please fill in all required travel parameters.',
        });
      }

      const targetUrl = (customWebhookUrl && typeof customWebhookUrl === 'string' && customWebhookUrl.trim())
        ? customWebhookUrl.trim()
        : DEFAULT_N8N_URL;

      const formData = new FormData();
      formData.append('field-0', String(name).trim());
      formData.append('field-1', String(email).trim());
      formData.append('field-2', String(destination).trim());
      formData.append('field-3', String(departureCity).trim());
      formData.append('field-4', String(startDate).trim());
      formData.append('field-5', String(endDate).trim());
      formData.append('field-6', String(travelers));
      formData.append('field-7', String(budget));
      formData.append('field-8', String(currency));
      formData.append('field-9', String(travelStyle));
      formData.append('field-10', String(accommodationType));

      // Multiselect fields must be JSON serialized array strings
      const foodArray = Array.isArray(foodPreferences) && foodPreferences.length > 0
        ? foodPreferences
        : ['No Preference'];
      formData.append('field-11', JSON.stringify(foodArray));

      const transportArray = Array.isArray(transportationPreferences)
        ? transportationPreferences
        : [];
      formData.append('field-12', JSON.stringify(transportArray));

      const n8nResponse = await fetch(targetUrl, {
        method: 'POST',
        body: formData,
      });

      const responseText = await n8nResponse.text();
      let responseJson: any = null;
      try {
        responseJson = JSON.parse(responseText);
      } catch {
        // response may be empty or html
      }

      if (n8nResponse.status >= 200 && n8nResponse.status < 300) {
        return res.json({
          success: true,
          status: n8nResponse.status,
          targetUrl,
          message: 'Trip planner request successfully submitted to n8n workflow engine!',
          data: responseJson || responseText || 'Success',
          timestamp: new Date().toISOString(),
          referenceId: 'VOY-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        });
      } else {
        return res.status(n8nResponse.status || 500).json({
          success: false,
          error: `n8n returned status ${n8nResponse.status}`,
          details: responseText,
        });
      }
    } catch (err: any) {
      console.error('Error submitting to n8n:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to communicate with n8n workflow endpoint.',
        message: err.message,
      });
    }
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
