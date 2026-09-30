import React, { useState } from 'react';
import {
  X,
  Workflow,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Code2,
  Copy,
  Check,
  Send,
} from 'lucide-react';

interface N8nIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customWebhookUrl: string;
  setCustomWebhookUrl: (url: string) => void;
  defaultUrl: string;
}

const FIELD_MAPPINGS = [
  { id: 'field-0', label: 'Name', type: 'String (text)', required: true },
  { id: 'field-1', label: 'Email', type: 'Email', required: true },
  { id: 'field-2', label: 'Destination', type: 'String (text)', required: true },
  { id: 'field-3', label: 'Departure city', type: 'String (text)', required: true },
  { id: 'field-4', label: 'Start date', type: 'Date (YYYY-MM-DD)', required: true },
  { id: 'field-5', label: 'End date', type: 'Date (YYYY-MM-DD)', required: true },
  { id: 'field-6', label: 'Number of travelers', type: 'Number', required: true },
  { id: 'field-7', label: 'Total Budget', type: 'Number', required: true },
  { id: 'field-8', label: 'Currency', type: 'Enum ("INR (₹)", "USD ($)", ...)', required: true },
  { id: 'field-9', label: 'Travel style', type: 'Enum ("Budget", "Standard", ...)', required: true },
  { id: 'field-10', label: 'Accomodation type', type: 'Enum ("Budget Hotel", ...)', required: true },
  { id: 'field-11', label: 'Food Preference', type: 'JSON Array String (multiselect)', required: true },
  { id: 'field-12', label: 'Transportation Preference', type: 'JSON Array String (multiselect)', required: false },
];

export const N8nIntegrationModal: React.FC<N8nIntegrationModalProps> = ({
  isOpen,
  onClose,
  customWebhookUrl,
  setCustomWebhookUrl,
  defaultUrl,
}) => {
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{
    ok: boolean;
    status: number;
    message: string;
  } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const currentUrl = customWebhookUrl.trim() || defaultUrl;

  const handlePing = async () => {
    setIsPinging(true);
    setPingResult(null);
    try {
      const res = await fetch(`/api/ping-n8n?url=${encodeURIComponent(currentUrl)}`);
      const data = await res.json();
      if (res.ok && data.ok) {
        setPingResult({
          ok: true,
          status: data.status,
          message: `Endpoint reachable (HTTP ${data.status}). Ready to accept submissions.`,
        });
      } else {
        setPingResult({
          ok: false,
          status: data.status || 500,
          message: data.error || `HTTP ${data.status} response from endpoint.`,
        });
      }
    } catch (err: any) {
      setPingResult({
        ok: false,
        status: 0,
        message: err.message || 'Network unreachable',
      });
    } finally {
      setIsPinging(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold">n8n Workflow Integration</h3>
              <p className="text-xs text-stone-400 font-mono">
                TRAVEL AGENT form node configuration & diagnostics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-stone-900 text-xs sm:text-sm">
          {/* Active Webhook URL box */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-600">
                Active n8n Form Endpoint
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-mono"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1 font-semibold"
                >
                  <span>Open n8n Form</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="p-2.5 bg-stone-900 text-amber-300 rounded-xl font-mono text-xs break-all select-all">
              {currentUrl}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePing}
                disabled={isPinging}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-white transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                <span>Test Endpoint Connectivity</span>
              </button>

              {customWebhookUrl && (
                <button
                  type="button"
                  onClick={() => setCustomWebhookUrl('')}
                  className="text-xs text-stone-500 hover:text-stone-800 underline font-mono"
                >
                  Reset to Default URL
                </button>
              )}
            </div>

            {pingResult && (
              <div
                className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  pingResult.ok
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {pingResult.ok ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{pingResult.message}</span>
              </div>
            )}
          </div>

          {/* Override URL for workflow authors */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Custom Webhook Override (Optional)
            </label>
            <p className="text-xs text-stone-500 mb-2">
              If you cloned the n8n workflow or created a new test form webhook, paste its URL here to route submissions directly to it.
            </p>
            <input
              type="url"
              value={customWebhookUrl}
              onChange={(e) => setCustomWebhookUrl(e.target.value)}
              placeholder="https://your-n8n-instance.app.n8n.cloud/form/..."
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Mapped Fields Table */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Code2 className="w-4 h-4 text-amber-600" />
              <h4 className="font-semibold text-stone-900 text-sm">Form Schema & Field Mappings</h4>
            </div>
            <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-stone-100 text-stone-600 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="py-2 px-3">Field ID</th>
                    <th className="py-2 px-3">Form Label</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {FIELD_MAPPINGS.map((f) => (
                    <tr key={f.id} className="hover:bg-stone-50/80">
                      <td className="py-2 px-3 font-mono font-semibold text-amber-700">{f.id}</td>
                      <td className="py-2 px-3 text-stone-800 font-medium">{f.label}</td>
                      <td className="py-2 px-3 text-stone-500 font-mono text-[11px]">{f.type}</td>
                      <td className="py-2 px-3">
                        {f.required ? (
                          <span className="text-amber-700 font-semibold text-[11px]">Yes</span>
                        ) : (
                          <span className="text-stone-400 text-[11px]">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-stone-900 hover:bg-stone-800 text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
