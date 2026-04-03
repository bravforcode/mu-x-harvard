import { completeStepServer } from "@/lib/serverFlowState";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string; stepId: string }> }
) {
  const { id, stepId } = await context.params;
  const patient = completeStepServer(id, stepId);
  if (!patient) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(patient);
}

