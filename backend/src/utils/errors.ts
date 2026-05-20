export class ApiError extends Error {
  status: number;
  code: string;
  fields?: Record<string, string>;

  constructor(status: number, code: string, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export const badRequest = (msg: string, fields?: Record<string, string>) =>
  new ApiError(400, "VALIDATION_ERROR", msg, fields);

export const unauthenticated = (msg = "Authentication required") =>
  new ApiError(401, "UNAUTHENTICATED", msg);

export const forbidden = (msg = "Forbidden") =>
  new ApiError(403, "FORBIDDEN", msg);

export const notFound = (msg = "Not found") =>
  new ApiError(404, "NOT_FOUND", msg);

export const conflict = (msg: string, fields?: Record<string, string>) =>
  new ApiError(409, "CONFLICT", msg, fields);
