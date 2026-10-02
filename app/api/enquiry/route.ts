import { enquirySchema, fieldErrors } from "@/lib/forms/schema";
import { handleFormPost } from "@/lib/server/form-endpoint";
import { saveEnquiry } from "@/lib/server/submissions";

export const dynamic = "force-dynamic";

function parseEnquiry(body: unknown) {
  const result = enquirySchema.safeParse(body);
  return result.success ? { success: true as const, data: result.data } : { success: false as const, errors: fieldErrors(result.error) };
}

export async function POST(request: Request) {
  return handleFormPost(request, { form: "enquiry", limitPerHour: 10, parse: parseEnquiry, save: saveEnquiry });
}
