"use client"

import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { pointer } from 'd3-selection'

export default function HomePage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) {
      router.push('/GraphPage')
      return
    }

    setLoading(true)
    try {
      // Call the API to get the most similar paper
      const response = await fetch(`https://researchmapperbackendserver-production.up.railway.app/search?query=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      // Navigate to graph page with the paper title
      router.push(`/GraphPage?paper=${encodeURIComponent(data.title)}`)
    } catch (error) {
      console.error('Error searching:', error)
      // Navigate to graph page anyway
      router.push('/GraphPage')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <main
      className="relative w-full"
      style={{
        minHeight: '100vh',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 960,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '68px',
            lineHeight: 1.05,
            fontWeight: 900,
            color: '#000',
            textAlign: 'center',
            letterSpacing: '-0.015em',
            marginBottom: 8,
          }}
        >
          Introducing Research Mapper
        </h1>
        <p
          style={{
            maxWidth: 820,
            textAlign: 'center',
            color: '#333',
            fontSize: 18,
            lineHeight: 1.6,
            marginTop: 8,
          }}
        >
          Your premier AI Research Navigation Tool
        </p>

        {/* Chat-like input */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'stretch',
            gap: 12,
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 20,
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              padding: '14px 18px',
              height: 64,
            }}
          >
            <input
              type="text"
              placeholder="Find me research papers on VLAs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: 18,
                color: '#111',
                background: 'transparent',
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            aria-label="Go"
            style={{
              height: 64,
              width: 64,
              borderRadius: 20,
              background: loading ? '#666' : '#000',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? '...' : <ArrowRight style={{ height: 24, width: 24 }} />}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>

          <button
            onClick={() => router.push('/GraphPage')}
            style={{
              borderRadius: 24,
              background: '#f5f5f5',
              color: '#111',
              padding: '14px 22px',
              fontSize: 16,
              fontWeight: 600,
              border: '1px solid rgba(0,0,0,0.08)',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Searching...' : 'Go to Graph'}
          </button>
        </div>
      </div>
    </main>
  )
}