export class ResponseBuilder<T = null> {
  readonly success: boolean;
  readonly message: string;
  readonly data?: T;
  readonly error?: string | string[];
  readonly statusCode?: number;

  private constructor(
    success: boolean,
    message: string,
    data?: T,
    error?: string | string[],
    statusCode?: number,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
    this.statusCode = statusCode;
  }

  static success<T>(message: string, data?: T, statusCode = 200) {
    return new ResponseBuilder(true, message, data, undefined, statusCode);
  }

  static failure(message: string, error?: string | string[], statusCode = 500) {
    return new ResponseBuilder(false, message, undefined, error, statusCode);
  }
}
