import { useState } from 'react';
import { VocabularyEntry } from '@/lib/types';

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
    vocabulary: VocabularyEntry;
    targetLanguage: string;
    onComplete: () => void;
}

export default function TranslationExercise({ vocabulary, targetLanguage, onComplete }: TranslationExerciseProps) {
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const [retries, setRetries] = useState(0);

    const checkAnswer = (input: string, answers: string[]): boolean => {
        const normalizedInput = input.trim().toLowerCase();
        return answers.some(ans => ans.toLowerCase() === normalizedInput);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (checkAnswer(userInput, vocabulary.answer)) {
            setIsCorrect(true);
            setFeedback(FEEDBACK[Math.floor(Math.random() * FEEDBACK.length)]);
            setTimeout(() => {
                onComplete();
            }, 1500);
        } else {
            setRetries(prev => prev + 1);
            if (retries >= 2) {
                setFeedback(`The correct answer is: ${vocabulary.answer[0]}`);
                setTimeout(() => {
                    onComplete();
                }, 2000);
            } else {
                setFeedback('Try again!');
            }
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                How do you say "{vocabulary.expression}" in {targetLanguage}?
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Type your answer..."
                    disabled={isCorrect}
                />
                <button
                    type="submit"
                    disabled={isCorrect}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    Check Answer
                </button>
            </form>
            {feedback && (
                <p className={`mt-4 text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {feedback}
                </p>
            )}
        </div>
    );
} 