'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { CourseWithLessons } from '@/lib/course-service'
import { getCourse } from '@/lib/course-service'
import LessonCard from '@/components/LessonCard'
import TranslationExercise from '@/components/TranslationExercise'
import SuccessScreen from '@/components/SuccessScreen'

export default function Dashboard() {
    const [user, setUser] = useState<any>(null)
    const [course, setCourse] = useState<CourseWithLessons | null>(null)
    const [currentLesson, setCurrentLesson] = useState<CourseWithLessons['lessons'][0] | null>(null)
    const [currentVocabularyIndex, setCurrentVocabularyIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [showSuccess, setShowSuccess] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/')
            } else {
                setUser(user)
                // Load course data
                const courseData = await getCourse('en-pt-1')
                setCourse(courseData)
                setLoading(false)
            }
        }
        getUser()
    }, [router, supabase])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    const handleStartLesson = (lessonId: number) => {
        if (!course) return
        const lesson = course.lessons.find(l => l.id === lessonId)
        if (lesson) {
            setCurrentLesson(lesson)
            setCurrentVocabularyIndex(0)
            setShowSuccess(false)
        }
    }

    const handleExerciseComplete = () => {
        if (currentLesson && currentVocabularyIndex < currentLesson.vocabulary.length - 1) {
            setCurrentVocabularyIndex(prev => prev + 1)
        } else {
            setShowSuccess(true)
        }
    }

    const handleBackToLessons = () => {
        setCurrentLesson(null)
        setCurrentVocabularyIndex(0)
        setShowSuccess(false)
    }

    if (!user || loading) {
        return <div className="min-h-screen bg-[#064E3B] text-white flex items-center justify-center">Loading...</div>
    }

    if (!course) {
        return <div className="min-h-screen bg-[#064E3B] text-white flex items-center justify-center">Course not found</div>
    }

    return (
        <div className="min-h-screen bg-[#064E3B] text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-[#065F46] rounded-2xl p-6 mb-8 border border-[#047857]">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-semibold text-white">
                                Welcome to {course.title}
                            </h3>
                            <div className="mt-2 text-sm text-gray-200">
                                <p>You are signed in as {user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#059669] hover:bg-[#047857] rounded-lg transition-colors duration-200"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {currentLesson ? (
                    showSuccess ? (
                        <SuccessScreen onBack={handleBackToLessons} />
                    ) : currentLesson.vocabulary && currentLesson.vocabulary.length > 0 ? (
                        <TranslationExercise
                            vocabulary={currentLesson.vocabulary[currentVocabularyIndex]}
                            targetLanguage={course.target_language}
                            onComplete={handleExerciseComplete}
                            onBack={handleBackToLessons}
                        />
                    ) : (
                        <div className="bg-[#065F46] rounded-2xl p-6 border border-[#047857] text-white">
                            No vocabulary items available for this lesson.
                        </div>
                    )
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Available Lessons</h2>
                        {course.lessons.map(lesson => (
                            <LessonCard
                                key={lesson.id}
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