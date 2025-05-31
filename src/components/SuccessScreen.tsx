import React from 'react';

interface SuccessScreenProps {
    onBack: () => void;
}

export default function SuccessScreen({ onBack }: SuccessScreenProps) {
    return (
        <div className="bg-[#065F46] rounded-2xl p-8 border border-[#047857] text-center">
            <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-[#A7F3D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Lesson Completed!</h2>
            <p className="text-gray-200 mb-8">Great job! You&apos;ve completed all the exercises in this lesson.</p>
            <button
                onClick={onBack}
                className="px-6 py-3 bg-[#059669] hover:bg-[#047857] text-white font-medium rounded-lg transition-colors duration-200"
            >
                Back to Lessons
            </button>
        </div>
    );
} 