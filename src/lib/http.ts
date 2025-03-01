interface HttpErrorType {
  status: number;
  payload: unknown;
}

class HttpError extends Error {
  status: number;
  payload: unknown;

  constructor({ status, payload }: HttpErrorType) {
    super(`HTTP Error: ${status}`);
    this.status = status;
    this.payload = payload;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const request = async <T>(method: Method, url: string, options?: RequestInit): Promise<{ status: number, payload: T }> => {
  const url_full = url.startsWith('/') ? `${url}` : `/${url}`;
  const finalHeaders = {
    ...(options?.headers ?? {}),
    ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
  }
  
  const finalBody = method === 'GET' || options?.body === undefined ? undefined : JSON.stringify(options.body);
  console.log("url",url_full);
  const response =  await fetch(url_full, {
    method,
    headers: finalHeaders,
    body: finalBody,
  });
  const payload = await response.json();
  if (!response.ok) {

    throw new HttpError({ status: response.status, payload });
  }
  const data = {
    status: response.status,
    payload: payload
  }
  return data;
};

const http = {
  get: <T>(url: string) => request<T>('GET', url),
  post: <T>(url: string, options: RequestInit) => request<T>('POST', url, options),
  delete: <T>(url: string, options: RequestInit) => request<T>('DELETE', url, options),
  put: <T>(url: string, options: RequestInit) => request<T>('PUT', url, options),
}

export default http;








