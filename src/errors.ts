interface IResponse {
    status?: number;
    statusText?: string;
}

abstract class FetchError extends Error {
    response?: IResponse;

    constructor (message: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace
            && Error.captureStackTrace(this, this.constructor);
    }

    toJSON () {
        return {
            name: this.name,
            message: this.message,
            response: this.response,
            stacktrace: this.stack
        };
    }
}

class ApiError extends FetchError {
    constructor (response: IResponse) {
        const message = `Request failed with status: ${response.status} ${
            response.statusText
        }`;

        super(message);
        this.message = message;
        this.response = response;
    }
}

class NetworkError extends FetchError {
    constructor (message: string) {
        super(message);
        this.message = message;
        this.response = null;
    }
}

const getErrorName = (error: FetchError) => error && error.name,
    isApiError = (error: FetchError): boolean =>
        error instanceof ApiError || getErrorName(error) === 'ApiError',
    isNetworkError = (error: FetchError): boolean =>
        error instanceof NetworkError || getErrorName(error) === 'NetworkError',
    isHttpErrorCode = (code: number, error: FetchError): boolean =>
        isApiError(error) && error.toJSON().response.status === code;

export { ApiError, NetworkError, isApiError, isNetworkError, isHttpErrorCode };
