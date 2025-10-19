// Fetch research papers from API

export async function fetchGraphData() {
  try {
    console.log('🌐 Fetching from /api/papers...')
    const response = await fetch('/api/papers')
    
    if (!response.ok) {
      console.error(`❌ API returned error status: ${response.status}`)
      throw new Error(`Failed to fetch papers: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('✅ API Response:', data)
    
    if (!data.papers) {
      console.error('❌ No papers field in API response:', data)
      return []
    }
    
    return data.papers
  } catch (error) {
    console.error('❌ Error fetching graph data:', error)
    return []
  }
}