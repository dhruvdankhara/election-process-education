export class ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };

  private constructor(
    success: boolean,
    data?: T,
    message?: string,
    error?: { code: string; message: string }
  ) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.error = error;
  }

  static success<T>(data: T, message?: string) {
    return new ApiResponse<T>(true, data, message);
  }

  static error(code: string, message: string) {
    return new ApiResponse<never>(false, undefined, undefined, {
      code,
      message,
    });
  }
}

export class ApiError extends Error {
  code: string;
  statusCode: number;

  constructor(code: string, message: string, statusCode: number = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}
