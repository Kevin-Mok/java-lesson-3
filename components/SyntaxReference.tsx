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
`# Python
class Robot:
    def __init__(self, name, battery=100):
        self.name = name
        self.battery = battery

// Java
public class Robot {
  private final String name;
  private int battery;

  public Robot(String name) {
    this(name, 100);
  }

  public Robot(String name, int battery) {
    this.name = name;
    this.battery = battery;
  }
}`
    });
  }

  if (has("method") || has("boolean") || has("void") || has("return") || has("canDrive") || has("driveStep")) {
    items.push({
      title: "Method and return syntax",
      code:
`# Python
class Robot:
    def can_drive(self):
        return self.battery >= DRIVE_COST

// Java
public boolean canDrive() {
  return battery >= DRIVE_COST;
}

public void stop() {
  // no return value
}`
    });
  }

  if (has("if") || has("guard") || has("safe") || has("battery") || has("step") || has("fail")) {
    items.push({
      title: "If / branch syntax",
      code:
`// Java
if (!canDrive()) {
  stop();
  return false;
} else {
  battery -= DRIVE_COST;
  return true;
}
`
    });
  }

  if (has("loop") || has("for") || has("attempt") || has("while")) {
    items.push({
      title: "Loop syntax",
      code:
`# Python
for step in range(3):
    if not drive_step():
        break

// Java
for (int step = 0; step < 3; step++) {
  if (!driveStep()) {
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
Motor[] motors = new Motor[] {leftMotor, rightMotor};
for (Motor motor : motors) {
  motor.stop();
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
private int battery = 100;
`
    });
  }

  if (items.length === 0) {
    items.push({
      title: "Java class shape reminder",
      code:
`public class Robot {
  // fields

  public Robot(String name, int battery) {
    this.name = name;
    this.battery = battery;
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
