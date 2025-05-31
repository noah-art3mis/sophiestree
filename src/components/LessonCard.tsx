import { Lesson } from '@/lib/types';

interface LessonCardProps {
    lesson: Lesson;
    onStart: (lessonId: number) => void;
}

export default function LessonCard({ lesson, onStart }: LessonCardProps) {
    return (
        <div className="bg-white shadow rounded-lg p-6 mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Lesson {lesson.lesson_id}: {lesson.title}
            </h3>
            <p className="text-sm text-gray-500 mb-2">Topic: {lesson.topic}</p>
            <p className="text-gray-700 mb-4">{lesson.preface}</p>
            <button
                onClick={() => onStart(lesson.lesson_id)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Start Lesson
            </button>
        </div>
    );
} 