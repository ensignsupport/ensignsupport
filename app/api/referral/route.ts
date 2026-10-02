import { parseReferral } from "@/lib/forms/schema";
import { handleFormPost } from "@/lib/server/form-endpoint";
import { saveReferral } from "@/lib/server/submissions";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleFormPost(request, { form: "referral", limitPerHour: 5, parse: parseReferral, save: saveReferral });
}
