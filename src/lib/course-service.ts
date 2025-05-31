import { createClient } from '@/lib/supabase'
import { Database } from './database.types'

type Course = Database['public']['Tables']['courses']['Row']
type Lesson = Database['public']['Tables']['lessons']['Row']
type Vocabulary = Database['public']['Tables']['vocabulary']['Row']

export interface CourseWithLessons extends Course {
    lessons: (Lesson & {
        vocabulary: Vocabulary[]
    })[]
}

export async function getCourse(slug: string): Promise<CourseWithLessons | null> {
    const supabase = createClient()

    // Get course
    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .single()

    if (courseError || !course) return null

    // Get lessons
    const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', course.id)
        .order('lesson_order')

    if (lessonsError || !lessons) return null

    // Get vocabulary for each lesson
    const lessonsWithVocabulary = await Promise.all(
        lessons.map(async (lesson) => {
            const { data: vocabulary } = await supabase
                .from('vocabulary')
                .select('*')
                .eq('lesson_id', lesson.id)

            return {
                ...lesson,
                vocabulary: vocabulary || [],
            }
        })
    )

    return {
        ...course,
        lessons: lessonsWithVocabulary,
    }
}

export async function getLesson(lessonId: number): Promise<(Lesson & { vocabulary: Vocabulary[] }) | null> {
    const supabase = createClient()

    // Get lesson
    const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single()

    if (lessonError || !lesson) return null

    // Get vocabulary
    const { data: vocabulary } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('lesson_id', lesson.id)

    return {
        ...lesson,
        vocabulary: vocabulary || [],
    }
} 