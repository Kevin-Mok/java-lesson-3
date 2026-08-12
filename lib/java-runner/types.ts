export type JavaRunRequest = {
  sourceCode: string;
  stdin?: string;
};

export type JavaRunResult = {
  stdout: string;
  stderr: string;
  compileOutput?: string;
  status: string;
  configured?: boolean;
};

export interface JavaRunner {
  run(request: JavaRunRequest): Promise<JavaRunResult>;
}
