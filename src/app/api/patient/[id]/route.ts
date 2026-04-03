import { getPatientServer } from "@/lib/serverFlowState";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const patient = getPatientServer(id);
  if (!patient) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(patient);
}

