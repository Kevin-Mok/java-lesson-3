import { NextRequest, NextResponse } from "next/server";
import { JavaRunRequest } from "@/lib/java-runner/types";
import { runner } from "@/lib/java-runner/judge0";

export const dynamic = "force-dynamic";

export async function GET() {
  const configured = Boolean(process.env.JUDGE0_API_URL && process.env.JUDGE0_API_KEY);

  return NextResponse.json({ configured });
}

export async function POST(request: NextRequest) {
  const configured = Boolean(process.env.JUDGE0_API_URL && process.env.JUDGE0_API_KEY);

  if (!configured) {
    return NextResponse.json({
      configured: false,
      status: "unavailable",
      stdout: "",
      stderr: "Java execution is not configured on this deployment."
    });
  }

  try {
    const body = (await request.json()) as JavaRunRequest;
    const result = await runner.run(body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        configured: false,
        status: "invalid",
        stdout: "",
        stderr: "Invalid execution request payload."
      },
      { status: 400 }
    );
  }
}
