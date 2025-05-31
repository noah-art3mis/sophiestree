'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Course, Lesson } from '@/lib/types'
import LessonCard from '@/components/LessonCard'
import TranslationExercise from '@/components/TranslationExercise'

// Sample course data - in a real app, this would come from your database
const sampleCourse: Course = {
    course_id: 1,
    course_slug: "en-pt-1",
    course: "English for Poets",
    origin_language: "English",
    target_language: "Portuguese",
    description: "English for Poets is a beginner-friendly course designed to help you express yourself",
    lessons: [
        {
            lesson_id: 1,
            title: "Basic Pronouns",
            topic: "Personal pronouns",
            preface: "Welcome to Lesson 1 of English for Poets. In this lesson, we'll begin with basic sentence structures using pronouns.",
            postface: "Well done! You've completed Lesson 1. Now you can use basic pronouns to form sentences in Portuguese.",
            vocabulary: [
                { expression: "I am", answer: ["eu sou", "eu estou"] },
                { expression: "You are", answer: ["você é", "você está"] },
                { expression: "He is", answer: ["ele é", "ele está"] },
                { expression: "She is", answer: ["ela é", "ela está"] },
            ],
        },
    ],
}

export default function Dashboard() {
    const [user, setUser] = useState<any>(null)
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
    const [currentVocabularyIndex, setCurrentVocabularyIndex] = useState(0)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/')
            } else {
                setUser(user)
            }
        }
        getUser()
    }, [router, supabase])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    const handleStartLesson = (lessonId: number) => {
        const lesson = sampleCourse.lessons.find(l => l.lesson_id === lessonId)
        if (lesson) {
            setCurrentLesson(lesson)
            setCurrentVocabularyIndex(0)
        }
    }

    const handleExerciseComplete = () => {
        if (currentLesson && currentVocabularyIndex < currentLesson.vocabulary.length - 1) {
            setCurrentVocabularyIndex(prev => prev + 1)
        } else {
            setCurrentLesson(null)
            setCurrentVocabularyIndex(0)
        }
    }

    if (!user) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Welcome to {sampleCourse.course}
                        </h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                            <p>You are signed in as {user.email}</p>
                        </div>
                        <div className="mt-5">
                            <button
                                onClick={handleSignOut}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {currentLesson ? (
                    <TranslationExercise
                        vocabulary={currentLesson.vocabulary[currentVocabularyIndex]}
                        targetLanguage={sampleCourse.target_language}
                        onComplete={handleExerciseComplete}
                    />
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Lessons</h2>
                        {sampleCourse.lessons.map(lesson => (
                            <LessonCard
                                key={lesson.lesson_id}
                                lesson={lesson}
                                onStart={handleStartLesson}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
} 