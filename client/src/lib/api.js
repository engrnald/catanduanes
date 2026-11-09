import QRCode from 'qrcode';
import { handle, qrToken, resetDemo } from './mock.js';
import { mode } from './mode.js';
// Demo mode (default): everything runs in the browser. Set VITE_API_URL to use the real Express server instead.
const REAL = import.meta.env.VITE_API_URL;
export const isDemo = !REAL;
const BASE = (REAL || '') + '/api';
export async function api(path, { method = 'GET', body } = {}) {
  if (isDemo && !mode.shared) return handle(method, path, body);
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}${path}`, { method, headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }, body: body && JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
export async function openQr(id, scope = 'admin') {
  const w = window.open('', '_blank'); if (!w) return alert('Please allow pop-ups to view the QR code.');
  try {
    const token = isDemo ? (mode.shared ? (await api(`/qr-token/${id}`)).token : qrToken(id)) : null;
    const src = isDemo ? await QRCode.toDataURL(`${location.origin}/checkin/${token}`, { width: 480, margin: 2 })
      : URL.createObjectURL(await (await fetch(`${BASE}/${scope}/qr/${id}.png`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })).blob());
    w.document.write(`<title>Check-in QR</title><body style="margin:0;display:grid;place-items:center;min-height:100vh"><img src="${src}" alt="QR code" style="max-width:90vmin"></body>`);
  } catch { w.close(); alert('Could not make the QR code.'); }
}

// Reset sample data (admin). In shared mode this resets the data for every visitor.
export async function resetAll() { if (mode.shared) { await api('/admin/reset', { method: 'POST' }); location.href = '/'; } else resetDemo(); }
