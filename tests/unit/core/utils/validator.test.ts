/**
 * @jest-environment node
 */
import { z } from "zod";
import { validateRequest } from "@/core/utils/validator";

describe("validateRequest", () => {
  const schema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    age: z.number().int().positive(),
  });

  const validator = validateRequest(schema);

  it("should parse and return valid data", async () => {
    const validData = { name: "Alice", age: 30 };
    const req = new Request("http://localhost/api", {
      method: "POST",
      body: JSON.stringify(validData),
    });

    const result = await validator(req);
    expect(result).toEqual(validData);
  });

  it("should throw an ApiError when validation fails", async () => {
    const invalidData = { name: "Al", age: -5 };
    const req = new Request("http://localhost/api", {
      method: "POST",
      body: JSON.stringify(invalidData),
    });

    await expect(validator(req)).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      message: "Name must be at least 3 characters",
      statusCode: 400,
    });
  });

  it("should throw ApiError when request JSON parsing fails", async () => {
    const req = {
      json: jest.fn().mockRejectedValue(new SyntaxError("Unexpected token")),
    } as unknown as Request;

    await expect(validator(req)).rejects.toMatchObject({
      code: "INVALID_JSON",
      message: "Invalid JSON payload",
      statusCode: 400,
    });
  });
});
