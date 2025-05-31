import { useState, useEffect, useRef } from 'react';
import { Database } from '@/lib/database.types';

type Vocabulary = Database['public']['Tables']['vocabulary']['Row']

const FEEDBACK = [
    "Great job!",
    "Well done!",
    "Keep it up!",
    "That's correct!",
    "Nice work!",
    "You're doing great!",
    "Excellent answer!",
    "Perfect!",
];

interface TranslationExerciseProps {
    vocabulary: Vocabulary;
    targetLanguage: string;
    onComplete: () => void;
    onBack: () => void;
}

export default function TranslationExercise({ vocabulary, targetLanguage, onComplete, onBack }: TranslationExerciseProps) {
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const [retries, setRetries] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Reset states when vocabulary changes
    useEffect(() => {
        setIsCorrect(false);
        setFeedback('');
        setUserInput('');
        setRetries(0);
        // Focus input when vocabulary changes
        inputRef.current?.focus();
    }, [vocabulary]);

    const checkAnswer = (input: string, answers: string[]): boolean => {
        const normalizedInput = input.trim().toLowerCase();
        return answers.some(ans => ans.toLowerCase() === normalizedInput);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (checkAnswer(userInput, vocabulary.answers)) {
            setIsCorrect(true);
            setFeedback(FEEDBACK[Math.floor(Math.random() * FEEDBACK.length)]);
            setUserInput('');
            onComplete();
        } else {
            setRetries(prev => prev + 1);
            if (retries >= 2) {
                setFeedback(`The correct answer is: ${vocabulary.answers[0]}`);
                setUserInput('');
                onComplete();
            } else {
                setFeedback('Try again!');
                setUserInput('');
            }
        }
        // Focus input after every submission
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    return (
        <div className="bg-[#065F46] rounded-2xl p-6 border border-[#047857]">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-white hover:text-[#A7F3D0] transition-colors duration-200"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Lessons
                </button>
            </div>
            <h3 className="text-xl font-medium text-white mb-6">
                How do you say &ldquo;{vocabulary.expression}&rdquo; in {targetLanguage}?
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="block w-full rounded-lg bg-[#064E3B] border border-[#047857] text-white placeholder-gray-300 px-4 py-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-colors duration-200"
                    placeholder="Type your answer and press Enter..."
                    disabled={isCorrect}
                    autoFocus
                />
            </form>
            {feedback && (
                <p className={`mt-4 text-sm ${isCorrect ? 'text-[#A7F3D0]' : 'text-red-300'}`}>
                    {feedback}
                </p>
            )}
        </div>
    );
} 