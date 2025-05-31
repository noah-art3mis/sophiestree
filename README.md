# Sophie's Tree

Sophie's Tree is a language learning application built with Next.js and Supabase, designed to help users learn languages through interactive exercises and structured courses.
 
## Features

- **Course-based Learning**: Structured courses with lessons and vocabulary exercises
- **Interactive Exercises**: Translation exercises with immediate feedback
- **Progress Tracking**: Track your progress through lessons and courses
- **User Authentication**: Secure user accounts with Supabase Auth
- **Responsive Design**: Works on desktop and mobile devices

## Architecture

### Frontend
- Built with Next.js 14 (App Router)
- TypeScript for type safety
- Tailwind CSS for styling
- Components:
  - `Dashboard`: Main course and lesson navigation
  - `LessonCard`: Displays lesson information and start button
  - `TranslationExercise`: Interactive vocabulary exercises
  - `SuccessScreen`: Completion screen for finished lessons

### Backend
- Supabase for:
  - Database (PostgreSQL)
  - Authentication
  - Real-time updates

### Database Schema

#### Courses
- `id`: Unique identifier
- `slug`: URL-friendly identifier
- `title`: Course name
- `origin_language`: Source language
- `target_language`: Language to learn
- `description`: Course description

#### Lessons
- `id`: Unique identifier
- `course_id`: Reference to parent course
- `title`: Lesson name
- `topic`: Lesson topic
- `preface`: Introduction text
- `postface`: Completion text
- `lesson_order`: Order in course

#### Vocabulary
- `id`: Unique identifier
- `lesson_id`: Reference to parent lesson
- `expression`: Word/phrase to translate
- `answers`: Array of correct translations

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Set up the database:
   ```bash
   npx tsx src/scripts/migrate-data.ts
   ```

## Development

### Key Files
- `src/app/dashboard/page.tsx`: Main dashboard and course navigation
- `src/components/TranslationExercise.tsx`: Vocabulary exercise component
- `src/lib/course-service.ts`: Course data fetching and management
- `src/scripts/migrate-data.ts`: Database seeding script

### Adding New Courses
1. Update the database schema if needed
2. Add course data to `migrate-data.ts`
3. Run the migration script

### Styling
- Uses Tailwind CSS with a custom color scheme
- Main colors:
  - Background: `#064E3B` (dark green)
  - Cards: `#065F46` (medium green)
  - Accents: `#059669` (light green)
  - Text: White and gray shades

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
