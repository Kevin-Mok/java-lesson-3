import {
  CodeQuestion,
  ConceptQuestion,
  LessonSection,
  PredictOutputQuestion,
  TransitionBlock,
  ExplanationBlock,
  CalloutBlock,
  LessonCodeBlock
} from "@/types/lesson";

export const LESSON_SECTIONS: LessonSection[] = [
  {
    id: "section-1",
    title: "Warm-Up + Previous Lesson Debug/Refactor",
    start: "0:00",
    end: "0:12",
    minutes: 12,
    objectives: [
      "Revisit Robot fields and methods from the prior lesson",
      "Differentiate clamping-after-action versus pre-check safety",
      "Introduce invariants for battery safety"
    ],
    blocks: [
      {
        id: "s1-exp-1",
        type: "explanation",
        title: "Previous Robot state model",
        markdown:
          "Last time you used a Robot with state like `String name`, `int battery`, and `int speed`, plus actions like `stop()`, `drive()`, and `showStatus()`. A common issue is allowing a drive when the battery is low, then clamping after subtracting cost."
      } as ExplanationBlock,
      {
        id: "s1-code-1",
        type: "code-example",
        title: "Previous-style drive behavior",
        code:
`if (battery <= 0) {
  speed = 0;
  return;
}

battery -= 10;

if (battery < 0) {
  battery = 0;
}`
      } as LessonCodeBlock,
      {
        id: "p1",
        type: "predict-output",
        prompt:
          "Predict what happens when the robot starts with 5 battery and `drive()` is called with speed 40. Does it report a drive? What is final battery?",
        javaSnippet:
`Robot robot = new Robot("R2", 5);
robot.setSpeed(40);
robot.drive();
robot.showStatus();`,
        expectedLines: ["allows drive", "-5 temporarily", "clamped to 0", "final battery 0", "reports drive"],
        modelAnswer:
"With this logic, `battery <= 0` passes at 5, then 10 is subtracted to -5 and later clamped. So the method reports/acts like drive happened, then fixes the state afterwards. This can be logically unsafe, even though final battery is not negative.",
        hint: "Check if the method tests for zero battery before driving or checks for full drive cost first."
      } as PredictOutputQuestion,
      {
        id: "q1",
        type: "concept",
        prompt: "If one drive step costs 10 battery, what condition should be checked before driving, and why is that safer than only clamping afterward?",
        concepts: [
          {
            id: "insufficient-energy",
            label: "insufficient-energy check",
            aliases: ["battery >= 10", "battery < 10", "at least 10", "enough battery", "drive cost", "10 units"]
          },
          {
            id: "prevent-action",
            label: "prevent-action",
            aliases: ["do not drive", "stop before", "prevent", "guard", "return"]
          },
          {
            id: "logical-safety",
            label: "logical-safety",
            aliases: [
              "doesn't perform invalid action",
              "avoids spending battery it doesn't have",
              "safe before changing state",
              "not just fix it afterward"
            ]
          }
        ],
        minimumConceptMatches: 2,
        modelAnswer:
"Check that the robot has at least 10 battery before changing state. If battery is below 10, stop or return instead of driving. That prevents an invalid action instead of allowing it and repairing the battery afterward.",
        hint:
"Think about the difference between preventing an invalid action and fixing a number after it already happened."
      } as ConceptQuestion,
      {
        id: "s1-trans-1",
        type: "transition",
        content:
          "Now that we can reason about safety, let's split Robot internals into dedicated parts. A single object can orchestrate multiple hardware modules more clearly."
      } as TransitionBlock
    ]
  },
  {
    id: "section-2",
    title: "Why Robot needs parts (Composition preview)",
    start: "0:12",
    end: "0:25",
    minutes: 13,
    objectives: [
      "Explain has-a relationships",
      "Contrast one object vs many fields",
      "Show composition as robot scalability"
    ],
    blocks: [
      {
        id: "s2-exp-1",
        type: "explanation",
        title: "Flat vs composed model",
        markdown:
          "A flat Robot might start with `leftMotorPower`, `rightMotorPower`, and `armMotorPower` fields. This grows hard to maintain. Composition means Robot owns Motor objects: `private Motor leftMotor; private Motor rightMotor;`"
      } as ExplanationBlock,
      {
        id: "q2",
        type: "concept",
        prompt:
          "Why might `Robot` contain `Motor` objects instead of storing every motor's power directly as separate fields?",
        concepts: [
          {
            id: "separate-responsibility",
            label: "separate responsibility",
            aliases: [
              "motor handles motor behavior",
              "separate responsibility",
              "encapsulation",
              "motor manages own state"
            ]
          },
          {
            id: "composition",
            label: "composition",
            aliases: ["has a motor", "has-a", "contains motor objects", "composition"]
          },
          {
            id: "scalability",
            label: "scalability/reuse",
            aliases: [
              "reuse",
              "easier to add motors",
              "less duplication",
              "easier to maintain"
            ]
          }
        ],
        minimumConceptMatches: 2,
        modelAnswer:
"A Motor object can manage its own power and safety, while Robot coordinates components. This keeps responsibilities separated and makes reusing motor behavior easier as the robot grows.",
        hint:
"Ask who owns the rules for motor limits and what happens when you add another motor in the future."
      } as ConceptQuestion,
      {
        id: "s2-callout-1",
        type: "callout",
        tone: "important",
        content:
          "Robot is not a motor. A robot has motors. `Robot is Motor` (inheritance-style) would be wrong here."
      } as CalloutBlock
    ]
  },
  {
    id: "section-3",
    title: "Create Motor class (object inside object)",
    start: "0:25",
    end: "0:40",
    minutes: 15,
    objectives: [
      "Create reusable component class",
      "Set and validate motor power",
      "Show independent motor state"
    ],
    blocks: [
      {
        id: "s3-exp-1",
        type: "explanation",
        markdown:
          "A motor now has its own state: name and power. Power range should be `-100..100` so reverse and forward are both legal. This is different from robot speed, which is usually `0..100`.",
        title: "Motor object fundamentals"
      } as ExplanationBlock,
      {
        id: "c1",
        type: "code",
        prompt:
          "Write a `Motor` class with private `String name`, private `int power`, constructor `Motor(String name)`, getter/setter, and `stop()`.",
        note: "Motor power must clamp to -100..100 when set.",
        requirements: [
          { id: "motor-class", description: "class Motor exists", patterns: ["class\\s+Motor", "class\s*Motor"] },
          { id: "motor-name", description: "name field", patterns: ["String\\s+name"] },
          { id: "motor-power", description: "power field", patterns: ["int\\s+power"] },
          { id: "motor-ctor", description: "constructor with String", patterns: ["Motor\\s*\\(\s*String\s+.*\)"] },
          { id: "motor-init", description: "power initialized to zero", patterns: ["power\s*=\s*0", "=\s*0;"] },
          { id: "getPower", description: "getter for power", patterns: ["getPower", "return\s+power"] },
          { id: "setPower", description: "setPower method", patterns: ["void\s+setPower", "setPower\s*\("] },
          { id: "motor-low", description: "lower bound -100", patterns: ["-100", "<\s*-100", ">=\s*-100"] },
          { id: "motor-high", description: "upper bound 100", patterns: ["100", ">\s*100", "<=\s*100"] },
          { id: "stop", description: "stop method", patterns: ["void\s+stop\s*\("] },
          { id: "stop-zero", description: "stop assigns 0", patterns: ["power\s*=\s*0"] }
        ],
        modelAnswer:
`class Motor {
  private String name;
  private int power;

  public Motor(String name) {
    this.name = name;
    this.power = 0;
  }

  public int getPower() {
    return power;
  }

  public void setPower(int power) {
    if (power < -100) {
      power = -100;
    } else if (power > 100) {
      power = 100;
    }

    this.power = power;
  }

  public void stop() {
    this.power = 0;
  }
}`
      } as CodeQuestion,
      {
        id: "p2",
        type: "predict-output",
        prompt: "Why does changing one motor not affect another? Predict values after this run:",
        javaSnippet:
`Motor left = new Motor("Left");
Motor right = new Motor("Right");

left.setPower(60);
right.setPower(20);
left.setPower(10);

System.out.println(left.getPower());
System.out.println(right.getPower());`,
        expectedLines: ["10", "20", "separate"],
        modelAnswer: "`left` and `right` are separate object instances. First set left to 60, right to 20, then left to 10. Output is 10 and 20.",
        hint: "Check whether Java passes object references or primitive values in this case."
      } as PredictOutputQuestion,
      {
        id: "q3",
        type: "concept",
        prompt: "Why did changing `left` to power 10 not change `right`?",
        concepts: [
          {
            id: "separate-objects",
            label: "separate objects",
            aliases: ["different objects", "separate instances", "two instances"]
          },
          {
            id: "separate-state",
            label: "separate state",
            aliases: ["own state", "independent state", "separate fields", "each object has its own power"]
          }
        ],
        minimumConceptMatches: 2,
        modelAnswer:
"`left` and `right` are different Motor instances. Each has its own `power` field, so changing one does not modify the other.",
        hint: "Mention object identity and separate memory for each instance."
      } as ConceptQuestion
    ]
  },
  {
    id: "section-4",
    title: "Control methods that return status",
    start: "0:40",
    end: "0:52",
    minutes: 12,
    objectives: [
      "Contrast void and boolean methods",
      "Add guard status method",
      "Make driving attempt observable"
    ],
    blocks: [
      {
        id: "s4-exp-1",
        type: "explanation",
        markdown:
          "`void stop()` performs an action and does not answer a question. `boolean canDrive()` answers whether a move is legal. `boolean driveStep()` can attempt movement and communicate success or failure. This enables higher-level control logic to branch safely."
      } as ExplanationBlock,
      {
        id: "q4",
        type: "concept",
        prompt:
          "Why might `boolean driveStep()` be more useful to autonomous control code than a `void driveStep()`?",
        concepts: [
          {
            id: "reports-result",
            label: "reports-result",
            aliases: ["reports success", "returns success", "true or false", "whether it worked"]
          },
          {
            id: "caller-decision",
            label: "caller-decision",
            aliases: ["caller can decide", "loop can stop", "control code can react", "if statement"]
          },
          {
            id: "failure",
            label: "failure",
            aliases: ["not enough battery", "failure", "cannot drive"]
          }
        ],
        minimumConceptMatches: 2,
        modelAnswer:
"A boolean return lets calling code know if a movement succeeded, so loops can stop and control systems can handle errors cleanly.",
        hint: "Think about what an autonomous routine can do with `if (!driveStep()) { ... }`."
      } as ConceptQuestion,
      {
        id: "c2",
        type: "code",
        prompt:
          "Implement `canDrive()` and `driveStep()` so `driveStep()` checks battery before decrementing and returns whether the step happened.",
        requirements: [
          { id: "canDrive", description: "boolean canDrive method", patterns: ["boolean\s+canDrive\s*\("] },
          { id: "canDrive-return", description: "battery comparison", patterns: ["battery\s*[<>]=\s*DRIVE_COST", "battery\s*>=\s*10", "DRIVE_COST"] },
          { id: "driveStep", description: "boolean driveStep", patterns: ["boolean\s+driveStep\s*\("] },
          { id: "driveStep-false", description: "false path", patterns: ["return\s+false"] },
          { id: "driveStep-subtract", description: "subtract DRIVE_COST", patterns: ["battery\s*-=\s*DRIVE_COST", "battery\s*=\s*\-"] },
          { id: "driveStep-true", description: "true path", patterns: ["return\s+true"] }
        ],
        modelAnswer:
`public boolean canDrive() {
  return battery >= DRIVE_COST;
}

public boolean driveStep() {
  if (!canDrive()) {
    stop();
    return false;
  }

  battery -= DRIVE_COST;
  return true;
}`
      } as CodeQuestion,
      {
        id: "s4-callout-1",
        type: "callout",
        tone: "tip",
        content:
          "Teacher note: multiple valid designs are acceptable. We care that status-returning methods communicate success/failure before control logic proceeds."
      } as CalloutBlock
    ]
  },
  {
    id: "section-5",
    title: "Constructor overloading + defaults",
    start: "0:52",
    end: "1:05",
    minutes: 13,
    objectives: [
      "Build overloaded constructors",
      "Use constructor chaining",
      "Provide default battery safely"
    ],
    blocks: [
      {
        id: "s5-exp-1",
        type: "explanation",
        title: "Overload with default safety",
        markdown:
          "Constructor overloading gives alternate constructor calls on the same class: `Robot(String name)` and `Robot(String name, int battery)`. Use `this(name, 100)` for convenience defaulting."
      } as ExplanationBlock,
      {
        id: "q5",
        type: "concept",
        prompt:
          "What is constructor overloading, and why might `Robot(String name)` still be useful when `Robot(String name, int battery)` exists?",
        concepts: [
          { id: "multiple", label: "multiple-constructors", aliases: ["multiple constructors", "more than one constructor", "same class"] },
          { id: "different", label: "different-parameters", aliases: ["different parameters", "different parameter lists", "different arguments"] },
          { id: "default", label: "default", aliases: ["default battery", "default value", "convenience"] },
          { id: "chaining", label: "chaining", aliases: ["this(...)", "constructor chaining", "reuse constructor"] }
        ],
        minimumConceptMatches: 2,
        modelAnswer:
"Overloading creates multiple valid ways to construct one class. A one-arg constructor gives a convenient common default while the two-arg constructor keeps explicit control for custom battery states.",
        hint: "Compare convenience versus explicit configuration."
      } as ConceptQuestion,
      {
        id: "c3",
        type: "code",
        prompt:
          "Add overloaded constructors so `new Robot(\"PracticeBot\")` starts with 100 battery, while `new Robot(\"PracticeBot\", 65)` uses explicit battery.",
        requirements: [
          { id: "two-ctors", description: "two Robot constructors", patterns: ["Robot\s*\(\s*String\s+.*\)", "Robot\s*\(\s*String\s+.*\s*,\s*int\s+.*\)"] },
          { id: "this-chain", description: "constructor chaining", patterns: ["this\s*\(\s*name\s*,\s*100\s*\)"] },
          { id: "battery-assign", description: "battery assigned", patterns: ["battery\s*=\s*clamp\(", "battery\s*=\s*.*battery"] },
          { id: "default-100", description: "default value 100", patterns: ["100"] }
        ],
        modelAnswer:
`public Robot(String name) {
  this(name, 100);
}

public Robot(String name, int battery) {
  this.name = name;
  this.battery = clamp(battery, MIN_BATTERY, MAX_BATTERY);
}`
      } as CodeQuestion
    ]
  },
  {
    id: "section-6",
    title: "Arrays/Lists of parts",
    start: "1:05",
    end: "1:22",
    minutes: 17,
    objectives: [
      "Store parts in an array",
      "Loop over components",
      "Discuss growth to collections"
    ],
    blocks: [
      {
        id: "s6-exp-1",
        type: "explanation",
        markdown:
          "Robot can keep both named fields and an array for batch operations. Keep references in the array so looped methods affect the same motor objects.",
        title: "Grouping motors"
      } as ExplanationBlock,
      {
        id: "q6",
        type: "concept",
        prompt: "Why is a motor array useful if Robot already has `leftMotor` and `rightMotor` fields?",
        concepts: [
          { id: "group", label: "group", aliases: ["group motors", "collection", "array", "treat them together"] },
          { id: "loop", label: "loop", aliases: ["loop", "for each", "iterate"] },
          { id: "less-duplication", label: "less-duplication", aliases: ["less duplicate code", "avoid repeating", "one operation for all motors"] },
          { id: "extensibility", label: "extensibility", aliases: ["add more motors", "scales", "more modules"] }
        ],
        minimumConceptMatches: 2,
        modelAnswer:
"Fields are handy for specific motor access; arrays let Robot apply the same action to many motors in one loop and scale to additional modules with minimal extra code.",
        hint: "Think about adding stopAllMotors and how arrays reduce repeated lines."
      } as ConceptQuestion,
      {
        id: "c4",
        type: "code",
        prompt:
          "Implement `stopAllMotors()` so every motor in `Motor[] motors` is stopped.",
        requirements: [
          { id: "motors-loop", description: "iterate motors", patterns: ["for\s*\([^)]*motors", "motors\.length", "motors\[.*\]"] },
          { id: "motor-stop", description: "call stop", patterns: ["motor\.stop\(\)"] }
        ],
        modelAnswer:
`public void stopAllMotors() {
  for (Motor motor : motors) {
    motor.stop();
  }
}`
      } as CodeQuestion,
      {
        id: "s6-callout-1",
        type: "callout",
        tone: "tip",
        content: "Preview: `ArrayList<Motor>` can grow and shrink at runtime; for this lesson we stay with arrays to keep loop and ownership concepts concrete."
      } as CalloutBlock
    ]
  },
  {
    id: "section-7",
    title: "Constants + helper methods",
    start: "1:22",
    end: "1:38",
    minutes: 16,
    objectives: [
      "Define static final rules",
      "Reduce magic numbers",
      "Centralize validation in clamp utility"
    ],
    blocks: [
      {
        id: "s7-exp-1",
        type: "explanation",
        title: "Give shared rules a name",
        markdown:
          "Use `private static final int MIN_BATTERY = 0`, `MAX_BATTERY = 100`, and `DRIVE_COST = 10`. This keeps behavior consistent in constructors, drive checks, and status checks."
      } as ExplanationBlock,
      {
        id: "q7",
        type: "concept",
        prompt: "Why is `private static final int DRIVE_COST = 10;` better than using raw `10` values everywhere?",
        concepts: [
          { id: "named", label: "named-meaning", aliases: ["meaningful name", "clear", "readability"] },
          { id: "single-source", label: "single-source", aliases: ["change once", "one place", "single source"] },
          { id: "consistency", label: "consistency", aliases: ["consistent", "avoid different values", "less duplication"] },
          { id: "final", label: "constant", aliases: ["cannot change", "final", "shared class value"] }
        ],
        minimumConceptMatches: 2,
        modelAnswer:
"A named constant gives one readable rule location. If drive cost changes later, we update one declaration instead of hunting literals throughout the Robot class.",
        hint: "Consider maintenance and accidental mismatch across methods."
      } as ConceptQuestion,
      {
        id: "c5",
        type: "code",
        prompt:
          "Implement `private static int clamp(int value, int min, int max)` with lower/upper bounds and return passthrough inside range.",
        requirements: [
          { id: "clamp-signature", description: "clamp signature", patterns: ["static\s+int\s+clamp\s*\("] },
          { id: "clamp-lower", description: "lower bound", patterns: ["if\s*\(value\s*<\s*min\)", "return\s+min"] },
          { id: "clamp-upper", description: "upper bound", patterns: ["if\s*\(value\s*>\s*max\)", "return\s+max"] },
          { id: "clamp-return", description: "return value", patterns: ["return\s+value"] }
        ],
        modelAnswer:
`private static int clamp(int value, int min, int max) {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}`
      } as CodeQuestion,
      {
        id: "s7-callout-1",
        type: "callout",
        tone: "important",
        content:
          "Keep the helper shared with both Robot battery checks and Motor power checks so each class enforces its own legal range consistently."
      } as CalloutBlock
    ]
  },
  {
    id: "section-8",
    title: "Mini autonomous routine loop",
    start: "1:38",
    end: "1:52",
    minutes: 14,
    objectives: [
      "Use bounded loops for autonomous behavior",
      "Stop on unsafe conditions",
      "Coordinate status methods and loop control"
    ],
    blocks: [
      {
        id: "s8-exp-1",
        type: "explanation",
        markdown:
          "Goal: attempt up to 3 drive steps, but stop early if the robot is no longer safe. Keep loops bounded for predictability and stop conditions explicit."
      } as ExplanationBlock,
      {
        id: "c6",
        type: "code",
        prompt:
          "Write `runAutonomous(Robot robot)` to attempt at most 3 `driveStep()` calls and stop early if a step fails.",
        requirements: [
          { id: "autonomous-loop", description: "bounded loop", patterns: ["for\s*\(\s*int\s+step\s*=\s*0\s*;\s*step\s*<\s*3\s*;\s*step\+\+\)", "while" ] },
          { id: "autonomous-call", description: "driveStep() call", patterns: ["driveStep\(\)"] },
          { id: "autonomous-break", description: "early stop", patterns: ["break", "false"] }
        ],
        modelAnswer:
`public static void runAutonomous(Robot robot) {
  for (int step = 0; step < 3; step++) {
    if (!robot.driveStep()) {
      break;
    }
  }
}`
      } as CodeQuestion,
      {
        id: "p3",
        type: "predict-output",
        prompt: "If a robot starts at battery 25 and each successful step costs 10, how many steps succeed before the autonomous routine stops?",
        javaSnippet:
`Robot r = new Robot("Scout", 25);
runAutonomous(r);`,
        expectedLines: ["2", "5 battery", "stops after second step"],
        modelAnswer:
"`runAutonomous` attempts 3 times. At 25 battery, two steps are valid and leaves 5. Third attempt fails, so total is 2 successful steps.",
        hint: "Step battery: 25→15→5; now less than 10.",
      } as PredictOutputQuestion,
      {
        id: "s8-exp-2",
        type: "callout",
        tone: "tip",
        content:
          "Bounded `for` loops are usually safer for introductory autonomous code than `while(true)` because max attempts are explicit and visible in the loop header."
      } as CalloutBlock
    ]
  },
  {
    id: "section-9",
    title: "Exit ticket + final challenge",
    start: "1:52",
    end: "2:00",
    minutes: 8,
    objectives: [
      "Check understanding with four exit questions",
      "Integrate composition, status, constants, and loops",
      "Demonstrate integration readiness"
    ],
    blocks: [
      {
        id: "s9-exp-1",
        type: "explanation",
        markdown:
          "Bring the ideas together: Robot composition, status-returning methods, constants/helpers, array-driven hardware control, and safe autonomous loops."
      } as ExplanationBlock,
      {
        id: "exit1",
        type: "concept",
        prompt: "In one or two sentences, what does composition mean in today's Robot design?",
        concepts: [
          { id: "compose", label: "composition", aliases: ["robot contains", "has Motor", "larger object using smaller objects"] },
          { id: "separate-responsibility", label: "responsibility", aliases: ["separate component responsibility", "each component handles own behavior"] }
        ],
        minimumConceptMatches: 2,
        modelAnswer:
"Composition means Robot is built using other objects like Motor instances. Motors keep their own state and behavior while Robot coordinates the overall machine.",
        hint: "Name both `Robot` and `Motor` in your answer."
      } as ConceptQuestion,
      {
        id: "exit2",
        type: "concept",
        prompt: "When would you choose `boolean` instead of `void` for a robot method?",
        concepts: [
          { id: "need-result", label: "need result", aliases: ["caller needs result", "know whether", "succeeded"] },
          { id: "control-flow", label: "control flow", aliases: ["if", "loop", "react", "control flow can react"] }
        ],
        minimumConceptMatches: 2,
        modelAnswer:
"Use boolean when caller code must branch based on whether the action succeeded or a condition is true.",
        hint: "Think about loops that should stop automatically."
      } as ConceptQuestion,
      {
        id: "exit3",
        type: "concept",
        prompt: "What problem does `static final` solve for values like `DRIVE_COST` or `MAX_BATTERY`?",
        concepts: [
          { id: "class-level", label: "class-level", aliases: ["shared constant", "class level", "one place"] },
          { id: "immutable", label: "immutable", aliases: ["cannot be reassigned", "not changeable", "final"] },
          { id: "meaning", label: "meaning", aliases: ["meaningful name", "readability", "single source"] }
        ],
        minimumConceptMatches: 2,
        modelAnswer:
"Static finals keep values in one clear, shared place and prevent accidental divergence between methods.",
        hint: "Describe the benefit for future changes."
      } as ConceptQuestion,
      {
        id: "exit4",
        type: "concept",
        prompt: "Name two protections that keep this autonomous loop from running forever or taking unsafe steps.",
        concepts: [
          { id: "bounded", label: "bounded", aliases: ["limit", "3 attempts", "fixed maximum"] },
          { id: "status", label: "status check", aliases: ["driveStep", "canDrive", "battery is sufficient"] },
          { id: "break", label: "break", aliases: ["break", "false", "stops early"] }
        ],
        minimumConceptMatches: 2,
        modelAnswer:
"The loop has a fixed max of 3 attempts, and `driveStep()` fails when battery is insufficient; a break stops the routine safely.",
        hint: "Mention loop bound and safety check separately."
      } as ConceptQuestion,
      {
        id: "final-challenge",
        type: "code",
        prompt:
          "Starting from today's Robot/Motor design, make an autonomous routine that: 1) sets both drive motors to 50, 2) attempts up to 3 safe steps, 3) stops all motors if a step fails, 4) stops all motors when done, 5) prints remaining battery.",
        requirements: [
          { id: "setpower", description: "set motor power", patterns: ["setDrivePower", "setPower", "50"] },
          { id: "attempt", description: "bounded attempts", patterns: ["<\s*3", "for\s*\(", "step"] },
          { id: "fail-stop", description: "step failure stop", patterns: ["if\s*\([^\n]*!\s*driveStep\(\)", "break"] },
          { id: "stopall", description: "stop all motors", patterns: ["stopAllMotors\(\)"] },
          { id: "battery-print", description: "print battery", patterns: ["System\.out\.println", "battery"] }
        ],
        modelAnswer:
`public static void runAutonomous(Robot robot) {
  robot.setDrivePower(50);

  for (int step = 0; step < 3; step++) {
    if (!robot.driveStep()) {
      robot.stopAllMotors();
      break;
    }
  }

  robot.stopAllMotors();
  System.out.println("Battery: " + robot.getBattery());
}`,
        hint: "If your Robot API names are different, adapt the same control flow: set both motors, loop with driveStep checks, stop all in both failure and finish.",
        note: "Optional final integration challenge; not a prerequisite for the earlier required checks."
      } as CodeQuestion
    ]
  }
];

export default LESSON_SECTIONS;
