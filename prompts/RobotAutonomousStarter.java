public class Main {

    public static class Motor {

        private String name;
        private int power;
        private final int driveCost;
        private int battery;

        public Motor(String name) {
            this(name, 100);
        }

        public Motor(String name, int battery) {
            this.name = name;
            this.battery = battery;
            this.power = 0;
            this.driveCost = 10;
        }

        public String getName() {
            return name;
        }

        public int getPower() {
            return power;
        }

        public int getBattery() {
            return battery;
        }

        public void setPower(int power) {
            // TODO: section-MOTOR-SETPOWER
            // 1) clamp to valid range
            // 2) assign to this.power
        }

        public void stop() {
            // TODO: section-MOTOR-STOP
            // 3) stop logic
        }

        public boolean canDrive() {
            // TODO: section-ROBOT-GUARD
            // 1) return whether there is enough battery for one step
            return false;
        }

        public boolean driveStep() {
            // TODO: section-ROBOT-STEP
            // 1) if canDrive() is false, stop and return false
            // 2) if canDrive() is true, reduce battery and return true
            return false;
        }
    }

    public static void auto(Motor leftMotor, Motor rightMotor) {
        // 1) set both drive motors to 50
        // TODO: section-1

        // 2) attempt up to 3 safe steps
        // TODO: section-2
        for (int step = 0; step < 3; step++) {
            // TODO:
            // - attempt one safe step for each side
            // - if a step fails, stop and break/return
        }

        // 3) if a step fails, stop both motors and end
        // TODO: section-3

        // 4) stop all motors when done
        // TODO: section-4

        // 5) print remaining battery
        // TODO: section-5
    }

    public static void main(String[] args) {
        Motor leftMotor = new Motor("Left Motor");
        Motor rightMotor = new Motor("Right Motor", 50);

        auto(leftMotor, rightMotor);
    }
}
