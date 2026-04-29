import { ApiResponse, ApiError } from "@/core/utils/api-response";

describe("ApiResponse", () => {
  it("should create a successful response", () => {
    const data = { id: 1, name: "Test" };
    const response = ApiResponse.success(data, "Success message");

    expect(response.success).toBe(true);
    expect(response.data).toEqual(data);
    expect(response.message).toBe("Success message");
    expect(response.error).toBeUndefined();
  });

  it("should create an error response", () => {
    const response = ApiResponse.error("NOT_FOUND", "Resource not found");

    expect(response.success).toBe(false);
    expect(response.data).toBeUndefined();
    expect(response.message).toBeUndefined();
    expect(response.error).toEqual({
      code: "NOT_FOUND",
      message: "Resource not found",
    });
  });
});

describe("ApiError", () => {
  it("should create an ApiError instance with default status code", () => {
    const error = new ApiError("INTERNAL_ERROR", "Something went wrong");

    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe("INTERNAL_ERROR");
    expect(error.message).toBe("Something went wrong");
    expect(error.statusCode).toBe(500);
  });

  it("should create an ApiError instance with custom status code", () => {
    const error = new ApiError("UNAUTHORIZED", "Not allowed", 401);

    expect(error.code).toBe("UNAUTHORIZED");
    expect(error.message).toBe("Not allowed");
    expect(error.statusCode).toBe(401);
  });
});
