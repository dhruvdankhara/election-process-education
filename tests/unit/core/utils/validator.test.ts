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

  it("should throw an ApiResponse error when validation fails", async () => {
    const invalidData = { name: "Al", age: -5 };
    const req = new Request("http://localhost/api", {
      method: "POST",
      body: JSON.stringify(invalidData),
    });

    await expect(validator(req)).rejects.toMatchObject({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Name must be at least 3 characters",
      },
    });
  });

  it("should throw standard errors when request JSON parsing fails", async () => {
    const req = {
      json: jest.fn().mockRejectedValue(new Error("Syntax error")),
    } as unknown as Request;

    await expect(validator(req)).rejects.toThrow("Syntax error");
  });
});
