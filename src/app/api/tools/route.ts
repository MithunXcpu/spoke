import { NextResponse } from "next/server";
import { getTools, createTool } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const department = searchParams.get("department") || undefined;

  const tools = getTools(department);
  return NextResponse.json({ tools });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const tool = createTool({
      name: body.name,
      description: body.description || "",
      outputType: body.outputType || "tracker",
      data: body.data,
      createdBy: body.userId || "anonymous",
      department: body.department || "general",
      isPublic: body.isPublic ?? true,
    });

    return NextResponse.json({ tool });
  } catch {
    return NextResponse.json({ error: "Failed to create tool" }, { status: 500 });
  }
}
