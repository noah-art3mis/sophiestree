export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: number
          slug: string
          title: string
          origin_language: string
          target_language: string
          description: string
          created_at: string
        }
        Insert: {
          id?: number
          slug: string
          title: string
          origin_language: string
          target_language: string
          description: string
          created_at?: string
        }
        Update: {
          id?: number
          slug?: string
          title?: string
          origin_language?: string
          target_language?: string
          description?: string
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: number
          course_id: number
          title: string
          topic: string
          preface: string
          postface: string
          lesson_order: number
          created_at: string
        }
        Insert: {
          id?: number
          course_id: number
          title: string
          topic: string
          preface: string
          postface: string
          lesson_order: number
          created_at?: string
        }
        Update: {
          id?: number
          course_id?: number
          title?: string
          topic?: string
          preface?: string
          postface?: string
          lesson_order?: number
          created_at?: string
        }
      }
      vocabulary: {
        Row: {
          id: number
          lesson_id: number
          expression: string
          answers: string[]
          created_at: string
        }
        Insert: {
          id?: number
          lesson_id: number
          expression: string
          answers: string[]
          created_at?: string
        }
        Update: {
          id?: number
          lesson_id?: number
          expression?: string
          answers?: string[]
          created_at?: string
        }
      }
    }
  }
} 