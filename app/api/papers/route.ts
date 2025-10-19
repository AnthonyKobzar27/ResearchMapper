import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = 'https://dvpmakgtfqyqfavcirhq.supabase.co'
const supabaseKey = process.env.SUPABASE_API || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  const {data, error} = await supabase.from("ResearchPapers").select("*")
  if (error) {
    return NextResponse.json({error: error.message}, {status: 500})
  }
  return NextResponse.json({papers: data})
}