"use client";

import { useRouter } from 'next/navigation';
import { ArrowRight, Home } from 'lucide-react';
import { useState } from 'react';

export default function GraphHeader() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      window.location.href = '/GraphPage';
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔍 Searching for:', query);
      const response = await fetch(`http://localhost:8000/search?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Search API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Search result:', data);
      
      // Force page reload with paper parameter to trigger search
      window.location.href = `/GraphPage?paper=${encodeURIComponent(data.title)}`;
    } catch (error) {
      console.error('❌ Error searching:', error);
      alert('Failed to search. Please try again.');
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 100,
        fontFamily: 'Inter, system-ui, sans-serif',
        pointerEvents: 'auto'
      }}
    >
      {/* Go Home button */}
      <button
        onClick={() => router.push('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
          fontFamily: 'Inter, system-ui, sans-serif',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#333';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#000';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
      >
        <Home size={18} />
        Home
      </button>

      {/* Search input with button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden'
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={loading ? "Searching..." : "Search paper..."}
          disabled={loading}
          style={{
            width: '280px',
            padding: '12px 16px',
            fontSize: '14px',
            border: 'none',
            outline: 'none',
            fontFamily: 'Inter, system-ui, sans-serif',
            backgroundColor: '#fff',
            cursor: loading ? 'wait' : 'text'
          }}
        />
        <button
          onClick={handleSearch}
          disabled={!query.trim() || loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 16px',
            backgroundColor: query.trim() && !loading ? '#000' : '#f3f4f6',
            color: query.trim() && !loading ? '#fff' : '#9ca3af',
            border: 'none',
            cursor: query.trim() && !loading ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            minWidth: '52px'
          }}
          onMouseEnter={(e) => {
            if (query.trim() && !loading) {
              e.currentTarget.style.backgroundColor = '#333';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = query.trim() && !loading ? '#000' : '#f3f4f6';
          }}
        >
          {loading ? (
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #fff',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
          ) : (
            <ArrowRight size={20} />
          )}
        </button>
      </div>
    </div>
  );
}
