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
    if (focusPaperTitle && filteredData.nodes.length > 0 && graphRef.current && !hasFocused) {
      console.log('🔍 Searching for paper:', focusPaperTitle);
      
      // Find the node by title (case insensitive search)
      const targetNode = filteredData.nodes.find(node => 
        node.title?.toLowerCase().includes(focusPaperTitle.toLowerCase()) ||
        node.name?.toLowerCase().includes(focusPaperTitle.toLowerCase())
      );
      
      if (targetNode) {
        console.log('✅ Found node, triggering click:', targetNode.title);
        setHasFocused(true); // Prevent re-focusing
        
        // Small delay to ensure graph is fully rendered
        setTimeout(() => {
          handleNodeClick(targetNode);
          setSelectedNode(targetNode);
          
          // Clear URL parameter after focusing
          window.history.replaceState({}, '', '/GraphPage');
        }, 500);
      } else {
        console.log('❌ Node not found for:', focusPaperTitle);
        // Clear URL parameter even if not found
        window.history.replaceState({}, '', '/GraphPage');
      }
    }
  }, [focusPaperTitle, filteredData.nodes, graphRef, handleNodeClick, setSelectedNode, hasFocused]);
  
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
