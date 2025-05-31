import { Database } from '@/lib/database.types'

type Lesson = Database['public']['Tables']['lessons']['Row']

interface LessonCardProps {
    lesson: Lesson;
    onStart: (lessonId: number) => void;
}

export default function LessonCard({ lesson, onStart }: LessonCardProps) {
    return (
        <div className="bg-[#065F46] rounded-2xl p-6 mb-4 border border-[#047857] hover:border-[#059669] transition-colors duration-200">
            <h3 className="text-xl font-semibold text-white mb-2">
                Lesson {lesson.lesson_order}: {lesson.title}
            </h3>
            <p className="text-sm text-[#A7F3D0] mb-2">Topic: {lesson.topic}</p>
            <p className="text-gray-200 mb-4">{lesson.preface}</p>
            <button
                onClick={() => onStart(lesson.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#059669] hover:bg-[#047857] rounded-lg transition-colors duration-200"
            >
                Start Lesson
            </button>
        </div>
    );
} 