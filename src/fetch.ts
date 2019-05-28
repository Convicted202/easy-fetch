import { ApiError, NetworkError } from './errors';

type ParsedResponse = ResponseInit | string;
interface AggregatedResponse {
  ok: boolean;
  status: number;
  statusText: string;
  headers: HeadersInit;
  parsed: object | string;
}

/* eslint-disable-next-line no-empty-function */
const noop = (): void => {};

const parseResponse = (data: string): Promise<ParsedResponse> =>
  new Promise(
    (resolve: Function): void => {
      try {
        const parsed = JSON.parse(data);

        resolve(parsed);
      } catch (e) {
        resolve(data);
      }
    }
  );

const gatherResponseData = (response: Response): Promise<AggregatedResponse> =>
  response
    .text()
    .then(parseResponse)
    .then(
      (data: ParsedResponse): AggregatedResponse => ({
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        parsed: data
      })
    );

class Fetch {
  private _url: RequestInfo;
  private _options?: RequestInit;

  private onApiErrorCallback: Function;
  private onNetworkErrorCallback: Function;
  private onResponseFormedCallback: Function;

  constructor(url: RequestInfo, options?: RequestInit) {
    this._url = url;
    this._options = options;

    this._handleErrors = this._handleErrors.bind(this);
    this._processFormedResponse = this._processFormedResponse.bind(this);
    return this;
  }

  private _handleErrors(e: Error): Promise<Error> {
    const onApiErrorCallback = this.onApiErrorCallback || noop;
    const onNetworkErrorCallback = this.onNetworkErrorCallback || noop;

    if (e instanceof ApiError) onApiErrorCallback(e);
    if (e instanceof NetworkError) onNetworkErrorCallback(e);

    return Promise.reject(e);
  }

  private _processFormedResponse(response: AggregatedResponse): AggregatedResponse {
    const onResponseFormed = this.onResponseFormedCallback || noop;

    onResponseFormed(response);
    return response;
  }

  request(): Promise<Error | object | string> {
    return fetch(this._url, this._options)
      .then(gatherResponseData)
      .then(this._processFormedResponse)
      .catch(e => Promise.reject(new NetworkError(e.message)))
      .then(response => {
        if (!response.ok) return Promise.reject(new ApiError(response));

        return response.parsed;
      })
      .catch(this._handleErrors);
  }

  url(url: RequestInfo): Fetch {
    this._url = url;
    return this;
  }

  options(options: RequestInit): Fetch {
    this._options = options;
    return this;
  }

  headers(headers: HeadersInit): Fetch {
    const oldHeaders = this._options.headers || {};

    return this.options({
      ...this._options,
      headers: { ...oldHeaders, ...headers }
    });
  }

  onResponseFormed(callback: Function): Fetch {
    this.onResponseFormedCallback = callback;
    return this;
  }

  onNetworkError(callback: Function): Fetch {
    this.onNetworkErrorCallback = callback;
    return this;
  }

  onApiError(callback: Function): Fetch {
    this.onApiErrorCallback = callback;
    return this;
  }
}

export default Fetch;
