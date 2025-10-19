// Process research paper data into graph format

import { ResearchPaper, GraphNode, GraphLink, GraphData } from './types'

export function processGraphData(papers: ResearchPaper[]): GraphData {
  console.log('🔄 Processing papers into graph data...', papers.length, 'papers')
  
  const nodes: GraphNode[] = []
  const links: GraphLink[] = []
  const nodeMap = new Map<string, GraphNode>()

  // Create nodes from papers with RANDOM initial positions for variance!
  papers.forEach((paper, idx) => {
    const citedByCount = paper.cited_by_count || 0
    const referenceIds = paper.references ? paper.references.split(';').filter(Boolean) : []
    const citedByIds = paper.cited_by ? paper.cited_by.split(';').filter(Boolean) : []
    
    // Random initial positions - MAXIMUM variance!
    const angle = Math.random() * Math.PI * 2
    const radius = 300 + Math.random() * 1500 // Random radius between 300-1800
    const randomX = Math.cos(angle) * radius + (Math.random() - 0.5) * 400 // Add noise
    const randomY = Math.sin(angle) * radius + (Math.random() - 0.5) * 400 // Add noise
    
    const node: GraphNode = {
      id: paper.id,
      name: paper.title,
      title: paper.title,
      influence: citedByCount + referenceIds.length,
      citedByCount,
      referenceCount: referenceIds.length,
      year: paper.publication_year,
      authors: paper.authors,
      concepts: paper.concepts,
      doi: paper.doi,
      url: paper.primary_url || paper.open_access_url,
      x: randomX,
      y: randomY
    }
    
    nodes.push(node)
    nodeMap.set(paper.id, node)
    
    if (idx < 3) {
      console.log(`📝 Sample node ${idx}:`, {
        id: node.id,
        title: node.title?.substring(0, 50),
        citations: node.citedByCount,
        refs: node.referenceCount
      })
    }
  })

  console.log(`✅ Created ${nodes.length} nodes`)

  // Create links from citations and references
  papers.forEach(paper => {
    if (paper.references) {
      const referenceIds = paper.references.split(';').filter(Boolean)
      referenceIds.forEach(refId => {
        if (nodeMap.has(refId)) {
          links.push({
            source: paper.id,
            target: refId,
            type: 'reference'
          })
        }
      })
    }
  })

  console.log(`✅ Created ${links.length} citation links`)

  // SUPER AGGRESSIVE LINK CREATION!
  // Multiple matching strategies: concepts, title keywords, year proximity
  let similarLinksCount = 0
  
  // Helper: Extract keywords from title
  const getKeywords = (title: string) => {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can']
    return title.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.includes(word))
  }
  
  papers.forEach((paper1, idx1) => {
    const concepts1 = paper1.concepts ? paper1.concepts.toLowerCase().split(',').map(c => c.trim()) : []
    const keywords1 = getKeywords(paper1.title)
    const year1 = paper1.publication_year || 0
    
    papers.forEach((paper2, idx2) => {
      if (idx2 <= idx1) return // Avoid duplicates and self-links
      
      const concepts2 = paper2.concepts ? paper2.concepts.toLowerCase().split(',').map(c => c.trim()) : []
      const keywords2 = getKeywords(paper2.title)
      const year2 = paper2.publication_year || 0
      
      let shouldLink = false
      let linkStrength = 0 // Track connection strength (0-1)
      let linkReason = ''
      
      // VISIBLE LINKS - We need connections!
      
      const sharedConcepts = concepts1.filter(c => concepts2.includes(c))
      const sharedKeywords = keywords1.filter(k => keywords2.includes(k))
      
      // Strategy 1: 2+ shared concepts (strong match)
      if (sharedConcepts.length >= 2) {
        shouldLink = true
        linkStrength = Math.min(sharedConcepts.length / 3, 1)
        linkReason = 'shared concepts'
      }
      
      // Strategy 2: 1 concept + 2 keywords
      if (!shouldLink && sharedConcepts.length >= 1 && sharedKeywords.length >= 2) {
        shouldLink = true
        linkStrength = 0.7
        linkReason = 'concept + keywords'
      }
      
      // Strategy 3: ANY shared concept (even small)
      if (!shouldLink && sharedConcepts.length >= 1) {
        shouldLink = true
        linkStrength = 0.55
        linkReason = 'shared concept'
      }
      
      // Strategy 4: 3+ shared keywords
      if (!shouldLink && sharedKeywords.length >= 3) {
        shouldLink = true
        linkStrength = 0.5
        linkReason = 'shared keywords'
      }
      
      if (shouldLink) {
        links.push({
          source: paper1.id,
          target: paper2.id,
          type: 'similar',
          strength: linkStrength // Store strength for coloring
        })
        similarLinksCount++
        
        // Log first few
        if (similarLinksCount <= 5) {
          console.log('🔗 Similar papers:', {
            paper1: paper1.title.substring(0, 30),
            paper2: paper2.title.substring(0, 30),
            reason: linkReason,
            sharedConcepts: sharedConcepts.length,
            sharedKeywords: sharedKeywords.length
          })
        }
      }
    })
  })

  console.log(`✅ Created ${links.length} total links (${similarLinksCount} similarity links, ${links.filter(l => l.type === 'reference').length} citation links)`)

  return { nodes, links }
}

export function calculateNodeSize(influence: number): number {
  return Math.max(6, Math.min(influence / 5, 20))
}


