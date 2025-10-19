"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useGraphStore } from '@/app/store/graphStore';
import GraphControls from './GraphControls';
import NodeSelectorModal from './modals/NodeSelectorModal';
import useGraphInteraction from './hooks/usGraphInteraction';
import { getNodeColor } from './utils/colorUtils';

// Dynamically import GraphRenderer with SSR disabled to prevent window errors
const GraphRenderer = dynamic(() => import('./GraphRenderer'), { 
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '2px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
        <p style={{ color: '#4b5563' }}>Loading graph visualization...</p>
      </div>
    </div>
  )
});

interface GraphCanvasProps {
  focusPaperTitle?: string;
}

const ResearchGraphCanvas = ({ focusPaperTitle }: GraphCanvasProps) => {
  const { filteredData, setSelectedNode } = useGraphStore();
  const {
    graphRef,
    selectedNode,
    isSheetOpen,
    setIsSheetOpen,
    handleNodeClick,
    handleZoomIn,
    handleZoomOut,
    handleResetView
  } = useGraphInteraction();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-focus on searched paper (only once)
  const [hasFocused, setHasFocused] = useState(false);
  
  useEffect(() => {
    if (!focusPaperTitle || filteredData.nodes.length === 0 || hasFocused) {
      return;
    }
    
    console.log('🔍🔍🔍 AUTO-FOCUS STARTING!', focusPaperTitle);
    
    // Wait for graph to be ready
    const timer = setTimeout(() => {
      console.log('⏰ Timer fired, searching for node...');
      
      // Find the node by title (case insensitive, partial match)
      const targetNode = filteredData.nodes.find(node => {
        const nodeTitle = (node.title || node.name || '').toLowerCase();
        const searchTitle = focusPaperTitle.toLowerCase();
        
        // Try exact match first
        if (nodeTitle === searchTitle) return true;
        
        // Try includes (partial match)
        if (nodeTitle.includes(searchTitle) || searchTitle.includes(nodeTitle)) return true;
        
        // Try first 30 characters (in case of truncation)
        if (nodeTitle.substring(0, 30) === searchTitle.substring(0, 30)) return true;
        
        return false;
      });
      
      if (targetNode) {
        console.log('✅✅✅ FOUND NODE!', targetNode.title);
        setHasFocused(true);
        
        // JUST ZOOM AND SHOW MODAL - NO ROUTER BULLSHIT!
        handleNodeClick(targetNode);
        setSelectedNode(targetNode);
      } else {
        console.error('❌❌❌ NODE NOT FOUND!', focusPaperTitle);
        console.log('Available titles:', filteredData.nodes.slice(0, 3).map(n => n.title || n.name));
        setHasFocused(true);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [focusPaperTitle, filteredData.nodes, hasFocused, handleNodeClick, setSelectedNode]);
  
  // Reset hasFocused when focusPaperTitle changes
  useEffect(() => {
    if (focusPaperTitle) {
      setHasFocused(false);
    }
  }, [focusPaperTitle]);

  console.log('📊 GraphCanvas - Nodes:', filteredData.nodes.length, 'Links:', filteredData.links.length);

  return (
    <>
      <GraphControls 
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
      />
      
      {isClient && filteredData.nodes.length > 0 ? (
        <GraphRenderer
          data={filteredData}
          onNodeClick={(node) => {
            handleNodeClick(node);
            setSelectedNode(node);
          }}
          getNodeColor={getNodeColor}
          graphRef={graphRef}
          focusPaperTitle={focusPaperTitle}
        />
      ) : (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: 48, 
              height: 48, 
              border: '4px solid #3b82f6', 
              borderTopColor: 'transparent', 
              borderRadius: '50%', 
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: '#4b5563', fontSize: 16 }}>
              {filteredData.nodes.length === 0 ? 'Loading research papers...' : 'Initializing graph...'}
            </p>
          </div>
        </div>
      )}
      
      <NodeSelectorModal
        node={selectedNode}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </>
  );
};

export default ResearchGraphCanvas;
