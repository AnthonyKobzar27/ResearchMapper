"use client"

import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import GraphCanvas from '../features/Graph/GraphCanvas'
import { useGraphStore } from '@/app/store/graphStore'
import { fetchGraphData } from '../features/Graph/DataFetch'
import { processGraphData } from '../features/Graph/GraphProcessor'
import GraphHeader from '../features/Graph/GraphHeader'

export default function GraphPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setData } = useGraphStore()
  const targetPaper = searchParams.get('paper')
  
  useEffect(() => {
    const loadData = async () => {
      console.log('📊 Starting to fetch research papers...')
      try {
        const papers = await fetchGraphData()
        console.log('📄 Fetched papers:', papers?.length || 0)
        
        if (papers && papers.length > 0) {
          const graphData = processGraphData(papers)
          console.log('🔗 Processed graph data:', {
            nodes: graphData.nodes.length,
            links: graphData.links.length
          })
          setData(graphData)
          console.log('✅ Data set in store successfully')
        } else {
          console.error('❌ No papers returned from API')
        }
      } catch (error) {
        console.error('❌ Error loading graph data:', error)
      }
    }
    loadData()
  }, [setData])

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <GraphHeader />
      
      {/* Graph fills entire background */}
      <GraphCanvas focusPaperTitle={targetPaper || undefined} />
    </div>
  )
}
