/**
 * Wrapper for the native fetch API to be used for API requests.
 * This avoids overwriting the global window.fetch.
 */
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(input, init);
}
