import { create } from 'zustand'
import { GraphData } from '../features/Graph/types'

interface Filters {
  searchQuery: string
  type: string
  department: string
  location: string
  role: string
  skillRange: [number, number]
  dateRange: {
    start: Date | null
    end: Date | null
  }
}

interface GraphStore {
  data: GraphData
  filteredData: GraphData
  selectedNode: any | null
  shouldRecenter: boolean
  filters: Filters
  departments: any[]
  nodes: any[]
  setData: (data: GraphData) => void
  setFilteredData: (data: GraphData) => void
  setSelectedNode: (node: any | null) => void
  setShouldRecenter: (should: boolean) => void
  setFilters: (filters: Partial<Filters>) => void
}

export const useGraphStore = create<GraphStore>((set) => ({
  data: { nodes: [], links: [] },
  filteredData: { nodes: [], links: [] },
  selectedNode: null,
  shouldRecenter: false,
  filters: {
    searchQuery: '',
    type: 'all',
    department: 'all',
    location: 'all',
    role: 'all',
    skillRange: [1, 5],
    dateRange: {
      start: null,
      end: null
    }
  },
  departments: [],
  nodes: [],
  setData: (data) => set({ data, filteredData: data, nodes: data.nodes }),
  setFilteredData: (filteredData) => set({ filteredData }),
  setSelectedNode: (selectedNode) => set({ selectedNode }),
  setShouldRecenter: (shouldRecenter) => set({ shouldRecenter }),
  setFilters: (newFilters) => set((state) => ({ 
    filters: { ...state.filters, ...newFilters } 
  })),
}))

