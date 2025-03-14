export class ApiResponse<T> {
    public status: string;
    public message: string;
    public data?: T;
    public errorCode?: string;
    public details?: any;

    constructor(status: "success" | "error", message: string, data?: T, errorCode?: string, details?: any) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.errorCode = errorCode;
        this.details = details;
    }

    static success<T>(message: string, data?: T): ApiResponse<T> {
        return new ApiResponse<T>("success", message, data);
    }

    static error(message: string, errorCode: string, details?: any): ApiResponse<null> {
        return new ApiResponse<null>("error", message, null, errorCode, details);
    }
}
