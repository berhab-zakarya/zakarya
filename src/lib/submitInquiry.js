/* Submission abstraction. The UI only knows this one function.
   - endpoint set  -> real POST; resolves { delivered: true } only on an HTTP 2xx, throws otherwise.
   - endpoint ""   -> local mode; nothing leaves the browser and it says so ({ delivered: false }). */
export async function submitInquiry(data, { endpoint = "", timeoutMs = 15000 } = {}) {
  if (!endpoint) {
    await new Promise((r) => setTimeout(r, 500));
    return { delivered: false };
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return { delivered: true };
  } finally {
    clearTimeout(timer);
  }
}
