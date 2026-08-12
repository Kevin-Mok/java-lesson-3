"use client";

import SyntaxHighlightedCode from "./SyntaxHighlightedCode";

interface SyntaxReferenceProps {
  prompt: string;
}

interface SyntaxItem {
  title: string;
  code: string;
}

function inferSyntaxReferences(prompt: string): SyntaxItem[] {
  const text = prompt.toLowerCase();
  const items: SyntaxItem[] = [];

  const has = (needle: string) => text.includes(needle);

  if (has("constructor") || has("overload") || has("new robot") || has("new motor")) {
    items.push({
      title: "Constructor syntax",
      code:
`// Java
public class Robot {
  private final String model;
  private int batteryLevel;

  public Robot(String model) {
    // overload/delegation pattern
    this(model, /* initialBattery */);
  }

  public Robot(String model, int batteryLevel) {
    // constructor overload #2
  }
}`
    });
  }

  if (has("method") || has("boolean") || has("void") || has("return") || has("canDrive") || has("driveStep")) {
    items.push({
      title: "Method and return syntax",
      code:
`// Java
public boolean canDrive() {
  // TODO: evaluate preconditions
  return <boolean_expression>;
}

public boolean driveStep() {
  // TODO: check precondition and update state
  return <boolean_expression>;
}`
    });
  }

  if (has("if") || has("guard") || has("safe") || has("battery") || has("step") || has("fail")) {
    items.push({
      title: "If / branch syntax",
      code:
`// Java
if (/* condition */) {
  // TODO
} else {
  // TODO
}
`
    });
  }

  if (has("loop") || has("for") || has("attempt") || has("while")) {
    items.push({
      title: "Loop syntax",
      code:
`// Java
for (int step = 0; step < 3; step++) {
  // TODO: run one step
  if (/* failed */) {
    break;
  }
}
`
    });
  }

  if (has("array") || has("motors") || has("collection")) {
    items.push({
      title: "Array syntax",
      code:
`// Java
Motor[] motors = new Motor[] { leftMotor, rightMotor };
for (Motor motor : motors) {
  // TODO: operate motor
}
`
    });
  }

  if (has("constant") || has("final") || has("static")) {
    items.push({
      title: "Constants / fields",
      code:
`// Java
private static final int DRIVE_COST = 10;
private int battery;
`
    });
  }

  if (items.length === 0) {
    items.push({
      title: "Java class shape reminder",
      code:
`// Java
public class Robot {
  private final String name;

  public Robot(String name, int battery) {
    // assign fields
  }
}
`
    });
  }

  return items;
}

export default function SyntaxReference({ prompt }: SyntaxReferenceProps) {
  const items = inferSyntaxReferences(prompt);

  return (
    <details className="rounded-md border border-emerald-300/40 bg-emerald-950/30 p-3 text-sm text-emerald-100" open>
      <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
        Java syntax references for this question
      </summary>
      <div className="mt-2 space-y-3">
        {items.map((item) => (
          <div key={item.title}>
            <p className="mb-1 text-xs font-semibold text-emerald-200">{item.title}</p>
            <SyntaxHighlightedCode code={item.code} className="border-emerald-900 p-2 text-xs" />
          </div>
        ))}
      </div>
    </details>
  );
}
