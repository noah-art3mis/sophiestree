import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../lib/database.types'

// Load environment variables from .env.local
config({ path: '.env.local' })

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const sampleCourse = {
    slug: "en-pt-1",
    title: "English for Poets",
    origin_language: "English",
    target_language: "Portuguese",
    description: "English for Poets is a beginner-friendly course designed to help you express yourself",
    lessons: [
        {
            title: "Basic Pronouns",
            topic: "Personal pronouns",
            preface: "Welcome to Lesson 1 of English for Poets. In this lesson, we'll begin with basic sentence structures using pronouns.",
            postface: "Well done! You've completed Lesson 1. Now you can use basic pronouns to form sentences in Portuguese.",
            lesson_order: 1,
            vocabulary: [
                { expression: "I am", answers: ["eu sou", "eu estou"] },
                { expression: "You are", answers: ["você é", "você está"] },
                { expression: "He is", answers: ["ele é", "ele está"] },
                { expression: "She is", answers: ["ela é", "ela está"] },
            ],
        },
    ],
}

async function migrateData() {
    try {
        // Insert course
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .insert({
                slug: sampleCourse.slug,
                title: sampleCourse.title,
                origin_language: sampleCourse.origin_language,
                target_language: sampleCourse.target_language,
                description: sampleCourse.description,
            })
            .select()
            .single()

        if (courseError) throw courseError

        // Insert lessons and vocabulary
        for (const lesson of sampleCourse.lessons) {
            const { data: lessonData, error: lessonError } = await supabase
                .from('lessons')
                .insert({
                    course_id: course.id,
                    title: lesson.title,
                    topic: lesson.topic,
                    preface: lesson.preface,
                    postface: lesson.postface,
                    lesson_order: lesson.lesson_order,
                })
                .select()
                .single()

            if (lessonError) throw lessonError

            // Insert vocabulary items
            const vocabularyItems = lesson.vocabulary.map(vocab => ({
                lesson_id: lessonData.id,
                expression: vocab.expression,
                answers: vocab.answers,
            }))

            const { error: vocabError } = await supabase
                .from('vocabulary')
                .insert(vocabularyItems)

            if (vocabError) throw vocabError
        }

        console.log('Migration completed successfully!')
    } catch (error) {
        console.error('Error during migration:', error)
    }
}

migrateData() 