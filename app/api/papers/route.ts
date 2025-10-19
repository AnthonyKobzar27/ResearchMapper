import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = 'https://dvpmakgtfqyqfavcirhq.supabase.co'
const supabaseKey = process.env.SUPABASE_API || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  // Fetch ALL papers (up to 10,000 - adjust if you have more)
  const {data, error} = await supabase
    .from("ResearchPapers")
    .select("*")
    .limit(10000)  // Explicitly set high limit
  
  if (error) {
    return NextResponse.json({error: error.message}, {status: 500})
  }
  
  console.log(`📊 Fetched ${data?.length || 0} papers from Supabase`)
  return NextResponse.json({papers: data})
}