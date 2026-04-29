import { z } from "zod";
import { asyncHandler } from "@/core/utils/async-handler";
import { ApiError, ApiResponse } from "@/core/utils/api-response";
import { requireAdminSession } from "@/core/auth/authorization";
import { electionDataService } from "@/modules/election/service/election-data.service";

const patchSchema = z
  .object({
    title: z.string().min(2).optional(),
    country: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
    type: z.string().min(2).optional(),
    description: z.string().min(2).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "At least one field required");

export const PATCH = asyncHandler(
  async (req: Request, context: { params: Promise<{ id: string }> }) => {
    const session = await requireAdminSession();
    const { id } = await context.params;
    const body = await patchSchema.parseAsync(await req.json());
    const updated = await electionDataService.updateElection(session.user.id, id, body);
    if (!updated) {
      throw new ApiError("NOT_FOUND", "Election not found", 404);
    }
    return Response.json(ApiResponse.success(updated, "Election updated"));
  }
);

export const DELETE = asyncHandler(
  async (_req: Request, context: { params: Promise<{ id: string }> }) => {
    const session = await requireAdminSession();
    const { id } = await context.params;
    const removed = await electionDataService.deleteElection(session.user.id, id);
    if (!removed) {
      throw new ApiError("NOT_FOUND", "Election not found", 404);
    }
    return Response.json(ApiResponse.success({ id }, "Election deleted"));
  }
);
