'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setLoading(true)
            const { error } = await supabase.auth.signUp({
                email,
                password,
            })
            if (error) throw error
            alert('Check your email for the confirmation link!')
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setLoading(true)
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error
            router.push('/dashboard')
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#064E3B]">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-3xl font-bold text-center text-white">
                        Welcome to Sophie's Tree
                    </h2>
                </div>
                <form className="mt-8 space-y-6">
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="relative block w-full px-3 py-2 text-white bg-[#065F46] placeholder-gray-300 border border-[#047857] rounded-md focus:outline-none focus:ring-[#059669] focus:border-[#059669] focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="relative block w-full px-3 py-2 text-white bg-[#065F46] placeholder-gray-300 border border-[#047857] rounded-md focus:outline-none focus:ring-[#059669] focus:border-[#059669] focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <button
                            type="submit"
                            onClick={handleSignIn}
                            disabled={loading}
                            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#059669] border border-transparent rounded-md group hover:bg-[#047857] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#059669]"
                        >
                            {loading ? 'Loading...' : 'Sign In'}
                        </button>
                        <button
                            type="submit"
                            onClick={handleSignUp}
                            disabled={loading}
                            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#065F46] border border-[#047857] rounded-md group hover:bg-[#064E3B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#059669]"
                        >
                            {loading ? 'Loading...' : 'Sign Up'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 