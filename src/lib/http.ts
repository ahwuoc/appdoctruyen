interface HttpErrorType
{
  status: number;
  payload: unknown;
}
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
interface CustomRequestOptions extends Omit<RequestInit, 'body'>
{
  body?: { [key: string]: unknown; } | null;
}
class HttpError extends Error
{
  status: number;
  payload: unknown;

  constructor({ status, payload }: HttpErrorType)
  {
    super(`HTTP Error: ${status}`);
    this.status = status;
    this.payload = payload;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}


const request = async <T>(
  method: Method,
  url: string,
  options?: CustomRequestOptions
): Promise<{ status: number; payload: T; }> =>
{
  const url_full = url.startsWith('/') ? `${url}` : `/${url}`;
  const finalHeaders = {
    ...(options?.headers ?? {}),
    ...(['POST', 'PUT', 'DELETE'].includes(method) ? { 'Content-Type': 'application/json' } : {}),
  };
  const finalBody = method === 'GET' || options?.body === undefined ? undefined : JSON.stringify(options.body);
  const response = await fetch(url_full, {
    method,
    headers: finalHeaders,
    body: finalBody,
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new HttpError({ status: response.status, payload });
  }
  return {
    status: response.status,
    payload: payload,
  };
};

const http = {
  get: <T>(url: string) => request<T>('GET', url),
  post: <T>(url: string, options: CustomRequestOptions) => request<T>('POST', url, options),
  delete: <T>(url: string, options: CustomRequestOptions) => request<T>('DELETE', url, options),
  put: <T>(url: string, options: CustomRequestOptions) => request<T>('PUT', url, options),
};

export default http;








