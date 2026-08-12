import { JavaRunRequest, JavaRunResult, JavaRunner } from "./types";

interface Judge0CreateResponse {
  token: string;
}

interface Judge0Result {
  status: { id: number; description: string };
  stdout: string;
  stderr: string;
  compile_output: string;
}

const WAIT_MS = 500;
const MAX_POLL_MS = 10000;

function configured() {
  return Boolean(process.env.JUDGE0_API_URL && process.env.JUDGE0_API_KEY);
}

export class Judge0Runner implements JavaRunner {
  async run(request: JavaRunRequest): Promise<JavaRunResult> {
    if (!configured()) {
      return {
        configured: false,
        status: "unavailable",
        stdout: "",
        stderr: "Judge0 is not configured for this deployment."
      };
    }

    const apiBase = process.env.JUDGE0_API_URL;
    const key = process.env.JUDGE0_API_KEY;

    if (!apiBase || !key) {
      return {
        configured: false,
        status: "unavailable",
        stdout: "",
        stderr: "Judge0 missing configuration."
      };
    }

    if (request.sourceCode.length > 20_000) {
      return {
        configured: true,
        status: "rejected",
        stdout: "",
        stderr: "Source code too large for this lesson runner."
      };
    }

    const payload = {
      source_code: request.sourceCode,
      language_id: 62,
      stdin: request.stdin ?? "",
      max_file_size: 20480
    };

    try {
      const create = await fetch(`${apiBase}/submissions?base64_encoded=false&wait=false`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-rapidapi-key": key
        },
        body: JSON.stringify(payload)
      });

      if (!create.ok) {
        return {
          configured: true,
          status: "error",
          stdout: "",
          stderr: `Submission failed: ${create.status}`
        };
      }

      const submission = (await create.json()) as Judge0CreateResponse;
      const deadline = Date.now() + MAX_POLL_MS;

      while (Date.now() < deadline) {
        const poll = await fetch(`${apiBase}/submissions/${submission.token}?base64_encoded=false`, {
          headers: {
            "content-type": "application/json",
            "x-rapidapi-key": key
          }
        });

        if (!poll.ok) {
          return {
            configured: true,
            status: "error",
            stdout: "",
            stderr: `Polling failed: ${poll.status}`
          };
        }

        const result = (await poll.json()) as Judge0Result;

        if ([1, 2].includes(result.status.id)) {
          return {
            configured: true,
            status: result.status.description,
            stdout: result.stdout || "",
            stderr: result.stderr || "",
            compileOutput: result.compile_output
          };
        }

        await new Promise((resolve) => setTimeout(resolve, WAIT_MS));
      }

      return {
        configured: true,
        status: "timeout",
        stdout: "",
        stderr: "Execution timed out."
      };
    } catch {
      return {
        configured: true,
        status: "error",
        stdout: "",
        stderr: "Unable to reach judge service."
      };
    }
  }
}

export const runner = new Judge0Runner();
