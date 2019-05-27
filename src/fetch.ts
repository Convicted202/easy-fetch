import { ApiError, NetworkError } from './errors';

const noop = () => {},

    parseResponse = data =>
        new Promise(resolve => {
            try {
                const parsed = JSON.parse(data);

                resolve(parsed);
            } catch (e) {
                resolve(data);
            }
        }),

    gatherResponseData = response =>
        response
            .text()
            .then(parseResponse)
            .then(data => ({
                ok: response.ok,
                status: response.status,
                statusText: response.statusText || data.statusText,
                headers: response.headers || {},
                parsed: data
            }));

class Fetch {
    _url: RequestInfo;
    _options?: RequestInit;

    onApiErrorCallback: Function;
    onNetworkErrorCallback: Function;

    constructor (url, options = {}) {
        this._url = url;
        this._options = options;

        this._handleErrors = this._handleErrors.bind(this);
        this._processFormedResponse = this._processFormedResponse.bind(this);
        return this;
    }

    private _handleErrors (e) {
        const onApiErrorCallback = this.onApiErrorCallback || noop,
            onNetworkErrorCallback = this.onNetworkErrorCallback || noop;

        if (e instanceof ApiError) onApiErrorCallback(e);
        if (e instanceof NetworkError) onNetworkErrorCallback(e);

        return Promise.reject(e);
    }

    private _processFormedResponse (response) {
        const onResponseFormed = this.onResponseFormed || noop;

        onResponseFormed(response);
        return response;
    }

    request () {
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

    url (url) {
        this._url = url;
        return this;
    }

    options (options) {
        this._options = options;
        return this;
    }

    headers (headers) {
        const oldHeaders = this._options.headers || {};

        return this.options({
            ...this._options,
            headers: { ...oldHeaders, ...headers }
        });
    }

    onResponseFormed (callback) {
        this.onResponseFormed = callback;
        return this;
    }

    onNetworkError (callback) {
        this.onNetworkErrorCallback = callback;
        return this;
    }

    onApiError (callback) {
        this.onApiErrorCallback = callback;
        return this;
    }
}

export default Fetch;
