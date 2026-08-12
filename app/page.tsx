import LessonApp from "@/components/LessonApp";
import { LESSON_SECTIONS } from "@/data/lesson";

export default function HomePage() {
  return <LessonApp lesson={LESSON_SECTIONS} />;
}
