"use client";

import { useRef, useState } from 'react';

const useGraphInteraction = () => {
  const graphRef = useRef<any>(null);
  const [selectedNode, setLocalSelectedNode] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleNodeClick = (node: any) => {
    console.log('🎯 Node clicked:', node.name);
    setLocalSelectedNode(node);
    setIsSheetOpen(true);
    
    // ZOOM IN ON NODE - Position at 25% of screen width
    if (graphRef.current && node.x !== undefined && node.y !== undefined) {
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
      const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
      
      // Get current zoom and position
      const currentZoom = graphRef.current.zoom();
      
      // Calculate where 25% of screen is in graph coordinates
      // We need to account for the current zoom level
      const targetZoom = 5; // Zoom level 5 instead of 8
      
      console.log('🔍 ZOOMING TO NODE:', {
        nodeX: node.x,
        nodeY: node.y,
        screenWidth,
        screenHeight,
        targetZoom
      });
      
      // First zoom, then center
      setTimeout(() => {
        if (graphRef.current) {
          // Zoom first
          graphRef.current.zoom(targetZoom, 600);
          
          // Then center the node - ForceGraph2D's centerAt expects graph coordinates
          // Position node at 25% from left edge in screen coordinates
          const targetScreenX = screenWidth * 0.25;
          const centerScreenX = screenWidth / 2;
          
          // Calculate offset needed in screen space
          const screenOffsetX = targetScreenX - centerScreenX;
          
          // Convert screen offset to graph coordinates at the target zoom
          const graphOffsetX = -screenOffsetX / targetZoom;
          
          const targetGraphX = node.x + graphOffsetX;
          
          console.log('📍 Centering at:', {
            targetGraphX,
            nodeY: node.y,
            screenOffsetX,
            graphOffsetX
          });
          
          graphRef.current.centerAt(targetGraphX, node.y, 600);
          console.log('✅ Zoom applied!');
        }
      }, 50);
    }
  };

  const handleZoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() * 1.2, 400);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() * 0.8, 400);
    }
  };

  const handleResetView = () => {
    if (graphRef.current) {
      graphRef.current.centerAt(0, 0, 1000);
      graphRef.current.zoom(1, 1000);
      setIsSheetOpen(false);
      setLocalSelectedNode(null);
    }
  };

  return {
    graphRef,
    selectedNode,
    isSheetOpen,
    setIsSheetOpen,
    handleNodeClick,
    handleZoomIn,
    handleZoomOut,
    handleResetView
  };
};

export default useGraphInteraction;
