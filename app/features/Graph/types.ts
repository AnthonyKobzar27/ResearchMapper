// Types for research paper graph

export interface ResearchPaper {
  id: string
  title: string
  doi?: string
  publication_year?: number
  publication_date?: string
  cited_by_count: number
  primary_url?: string
  source?: string
  is_open_access?: boolean
  open_access_url?: string
  authors?: string
  concepts?: string
  references?: string
  cited_by?: string
}

export interface GraphNode {
  id: string
  name: string
  title: string
  x?: number
  y?: number
  z?: number
  influence: number
  citedByCount: number
  referenceCount: number
  year?: number
  authors?: string
  concepts?: string
  doi?: string
  url?: string
}

export interface GraphLink {
  source: string
  target: string
  type: 'citation' | 'reference' | 'similar'
  strength?: number // Connection strength (0-1)
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}
