import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../lib/database.types'

// Load environment variables from .env.local
config({ path: '.env.local' })

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function cleanupData() {
    try {
        // Delete in reverse order of dependencies
        const { error: vocabError } = await supabase
            .from('vocabulary')
            .delete()
            .neq('id', 0) // Delete all records

        if (vocabError) throw vocabError

        const { error: lessonsError } = await supabase
            .from('lessons')
            .delete()
            .neq('id', 0) // Delete all records

        if (lessonsError) throw lessonsError

        const { error: coursesError } = await supabase
            .from('courses')
            .delete()
            .neq('id', 0) // Delete all records

        if (coursesError) throw coursesError

        console.log('Cleanup completed successfully!')
    } catch (error) {
        console.error('Error during cleanup:', error)
    }
}

cleanupData() 