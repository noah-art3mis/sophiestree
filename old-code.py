import json
from os import remove
import random
from dataclasses import dataclass
import re

FEEDBACK = [
    "Great job!",
    "Well done!",
    "Keep it up!",
    "That's correct!",
    "Nice work!",
    "You're doing great!",
    "Excellent answer!",
    "Perfect!",
]

SENTENCE_TEMPLATES = [
    "So how would you say <<ANSWER>>",
    "And how would you say <<ANSWER>>",
    "In <<LANGUAGE>>, <<EXP>> means — <<ANSWER>>. So how would you say <<ANSWER>>",
    "What about <<ANSWER>>",
    "Now try <<ANSWER>>",
    "While <<EXP>> in <<LANGUAGE>> would be - <<ANSWER>>",
    "Try <<ANSWER>>",
    "now say <<ANSWER>>",
]

CORRECTIONS = [
    "The right way to say it would be <<ANSWER>>. Now you try how would you say <<ANSWER>>"
]

RECAPS = ["Today we learned that <<ALL_TASKS>>"]

###


@dataclass
class VocabularyEntry:
    expression: str
    answer: list[str]


@dataclass
class Lesson:
    lesson_id: int
    title: str
    topic: str
    preface: str
    postface: str
    vocabulary: list[VocabularyEntry]


@dataclass
class Course:
    course_id: int
    course_slug: str
    course: str
    origin_language: str
    target_language: str
    description: str
    lessons: list[Lesson]


###

course_data = {
    "course_id": 1,
    "course_slug": "en-pt-1",
    "course": "English for Poets",
    "origin_language": "English",
    "target_language": "Portuguese",
    "description": "English for Poets is a beginner-friendly course designed to help you express yourself ",
    "lessons": [
        {
            "lesson_id": 1,
            "title": "Basic Pronouns",
            "topic": "Personal pronouns",
            "preface": "Welcome to Lesson 1 of English for Poets. In this lesson, we’ll begin with basic sentence structures using pronouns. Perfect for beginners or those looking to refresh their Portuguese.",
            "postface": "Well done! You’ve completed Lesson 1. Now you can use basic pronouns to form sentences in Portuguese. These are essential for expressing thoughts clearly. Let’s move on!",
            "vocabulary": [
                {"expression": "I am", "answer": ["eu sou", "eu estou"]},
                {"expression": "You are", "answer": ["você é", "você está"]},
                {"expression": "He is", "answer": ["ele é", "ele está"]},
                {"expression": "She is", "answer": ["ela é", "ela está"]},
            ],
        },
        {
            "lesson_id": 2,
            "title": "Basic Emotions",
            "topic": "Feelings and states",
            "preface": "Lesson 2 introduces basic emotional vocabulary. You’ll learn how to express feelings like happiness and tiredness in Portuguese.",
            "postface": "Awesome work! Now you can say how you and others feel using basic adjectives in Portuguese. Let’s keep going!",
            "vocabulary": [
                {"expression": "happy", "answer": ["feliz"]},
                {"expression": "tired", "answer": ["cansado", "cansada"]},
                {"expression": "hungry", "answer": ["com fome"]},
                {"expression": "cold", "answer": ["com frio"]},
                {"expression": "warm", "answer": ["quente"]},
                {"expression": "sad", "answer": ["triste"]},
            ],
        },
        {
            "lesson_id": 3,
            "title": "Emotions + Time",
            "topic": "Feelings in context",
            "preface": "Lesson 3 combines emotional states with expressions of time. You’ll learn how to say things like 'I am happy today' in Portuguese.",
            "postface": "Great! You now know how to combine feelings with time in Portuguese. Let’s learn to ask questions next.",
            "vocabulary": [
                {"expression": "today", "answer": ["hoje"]},
                {"expression": "Are you happy?", "answer": ["Você está feliz?"]},
                {
                    "expression": "Are you tired?",
                    "answer": ["Você está cansado?", "Você está cansada?"],
                },
                {"expression": "Are you sad?", "answer": ["Você está triste?"]},
                {"expression": "Are you cold?", "answer": ["Você está com frio?"]},
                {"expression": "Are you hungry?", "answer": ["Você está com fome?"]},
            ],
        },
        {
            "lesson_id": 4,
            "title": "Places and Location",
            "topic": "Being somewhere",
            "preface": "In Lesson 4, we talk about places. You’ll learn how to say where people are in Portuguese.",
            "postface": "Awesome. Now you know how to say where you and others are in Portuguese. This is crucial for conversation.",
            "vocabulary": [
                {"expression": "here", "answer": ["aqui"]},
                {"expression": "there", "answer": ["lá"]},
                {"expression": "at home", "answer": ["em casa"]},
            ],
        },
        {
            "lesson_id": 5,
            "title": "Negation",
            "topic": "Saying not",
            "preface": "Lesson 5 teaches you how to say 'not' in Portuguese to express the opposite of something.",
            "postface": "Nice work! You can now say what something is *not* in Portuguese. This is a big step forward in communication.",
            "vocabulary": [
                {"expression": "not", "answer": ["não"]},
                {
                    "expression": "I am not tired",
                    "answer": ["Eu não estou cansado", "Eu não estou cansada"],
                },
                {"expression": "You are not sad", "answer": ["Você não está triste"]},
                {"expression": "He is not hungry", "answer": ["Ele não está com fome"]},
                {"expression": "She is not happy", "answer": ["Ela não está feliz"]},
                {"expression": "I am not at home", "answer": ["Eu não estou em casa"]},
                {"expression": "You are not there", "answer": ["Você não está lá"]},
                {"expression": "She is not here", "answer": ["Ela não está aqui"]},
                {
                    "expression": "He is not at home today",
                    "answer": ["Ele não está em casa hoje"],
                },
            ],
        },
    ],
}


def run_translation_demo(course_data: dict) -> None:

    def get_feedback() -> str:
        return random.choice(FEEDBACK)

    def get_correction(answer) -> str:
        template = random.choice(CORRECTIONS)
        return template.replace("<<ANSWER>>", answer)

    def check_answer(user_input: str, correct_answers: list[str]) -> bool:
        def remove_accents_ascii(input_str: str) -> str:
            return input_str.encode("ascii", errors="ignore").decode("ascii")

        user_input_norm = remove_accents_ascii(user_input.strip().lower())
        for ans in correct_answers:
            if user_input_norm == ans.lower():
                return True
        return False

    def get_prompt(expression: str, answers: list[str], language: str) -> str:
        template = random.choice(SENTENCE_TEMPLATES)
        return (
            template.replace("<<LANGUAGE>>", language)
            .replace("<<EXP>>", expression)
            .replace("<<ANSWER>>", answers[0])
        ) + "\n"

    def check_task(answers: list[str], expression: str, prompt: str) -> None:
        retries = -1
        while True:
            retries += 1

            if retries == 3:
                print("\nfine lets move on")
                break

            user_answer = input(prompt)

            if check_answer(user_answer, answers):
                print()
                break
                retries += 1

            # if wrong
            print()
            print(get_correction(answers[0]))

    print(
        f"Welcome to 🌳 SOPHIE'S TREE 🌳: {course_data.get('course', 'Language Course')}"
    )
    print(
        f"Translating from {course_data.get('origin_language')} to {course_data.get('target_language')}"
    )
    print()

    for lesson in course_data.get("lessons"):
        print(f"Lesson {lesson['lesson_id']}: {lesson['title']}")
        print(lesson.get("preface", ""))
        print()

        vocab = lesson.get("vocabulary")
        for entry in vocab:
            expression = entry.get("expression")
            answers = entry.get("answer")

            prompt = get_prompt(expression, answers, course_data.get("target_language"))

            check_task(answers, expression, prompt)

            if random.random() < 0.2:
                print(get_feedback())
                print()

        print(lesson.get("postface", ""))
        print("-" * 40)

    print("Thanks for learning with us! Goodbye. ")
    print("🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳")


def main():
    run_translation_demo(course_data)


if __name__ == "__main__":
    main()
