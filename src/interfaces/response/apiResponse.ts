export class ApiResponse<T> {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly data: T
  ) {}
}

export class ApiResponseWithToken<T> {
  constructor(
    public readonly statusCode: number,
    public readonly token: string,
    public readonly message: string,
    public readonly data: T
  ) {}
}
