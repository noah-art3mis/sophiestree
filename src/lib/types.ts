export interface VocabularyEntry {
    expression: string;
    answer: string[];
}

export interface Lesson {
    lesson_id: number;
    title: string;
    topic: string;
    preface: string;
    postface: string;
    vocabulary: VocabularyEntry[];
}

export interface Course {
    course_id: number;
    course_slug: string;
    course: string;
    origin_language: string;
    target_language: string;
    description: string;
    lessons: Lesson[];
} 