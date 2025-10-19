"use client";

import React, { useState, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { getNodeColor, getLinkColor, getLinkWidth } from './utils/colorUtils';
import TaskTooltip from './TaskTooltip';

interface GraphRendererProps {
  data: any;
  onNodeClick: (node: any) => void;
  graphRef: React.MutableRefObject<any>;
  focusPaperTitle?: string;
  getNodeColor?: (type: string | number) => string;
}

const GraphRenderer = ({ data, onNodeClick, graphRef, focusPaperTitle, getNodeColor: externalGetNodeColor }: GraphRendererProps) => {
  const nodeColorFn = externalGetNodeColor || getNodeColor;
  const [tooltipData, setTooltipData] = useState<{
    node: any;
    visible: boolean;
    x: number;
    y: number;
  }>({ node: null, visible: false, x: 0, y: 0 });

  const [dimensions, setDimensions] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1920, 
    height: typeof window !== 'undefined' ? window.innerHeight : 1080 
  });
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Track mouse position globally
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      console.log('📐 Window dimensions:', { width, height });
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    // Log node citation stats
    const citationCounts = data.nodes.map((n: any) => n.citedByCount || 0);
    const maxCitations = Math.max(...citationCounts);
    const avgCitations = citationCounts.reduce((a: number, b: number) => a + b, 0) / citationCounts.length;
    
    console.log('🎨 GraphRenderer mounted:', {
      nodes: data.nodes.length,
      links: data.links.length,
      dimensions,
      citationStats: {
        max: maxCitations,
        avg: avgCitations.toFixed(1),
        range: `${Math.min(...citationCounts)} - ${maxCitations}`
      }
    });
    
    // Log sample node sizes
    const sampleNode = data.nodes[0];
    if (sampleNode) {
      console.log('📏 Sample node size calculation:', {
        paper: sampleNode.name.substring(0, 50),
        citations: sampleNode.citedByCount,
        calculatedSize: getNodeSize(sampleNode)
      });
    }
  }, [data, dimensions]);

  // Configure force-directed layout for ORGANIC, NON-SPHERICAL layout
  useEffect(() => {
    if (graphRef.current) {
      try {
        // Strong but varied repulsion for organic clustering
        graphRef.current.d3Force('charge')
          .strength((node: any) => {
            // Vary charge by citation count for natural clustering
            const base = -1200; // Increased repulsion for more spread
            const variance = Math.random() * 600; // More variance
            return base - variance;
          })
          .distanceMax(2000); // Increased max distance
        
        // Variable link distance with MORE randomness
        if (graphRef.current.d3Force('link')) {
          graphRef.current.d3Force('link')
            .distance((link: any) => {
              // More variance for organic layout
              const baseDistance = link.type === 'similar' ? 250 : 450;
              const variance = Math.random() * 200; // Big variance
              return baseDistance + variance;
            })
            .strength((link: any) => {
              // Variable strength for organic clustering
              const baseStrength = link.type === 'similar' ? 0.4 : 0.15;
              return baseStrength + Math.random() * 0.2; // Random variance
            });
        }
        
        // DISABLE centering force for non-spherical layout!
        graphRef.current.d3Force('center', null);
        
        console.log('🔧 Force layout configured: ORGANIC, NON-SPHERICAL');
      } catch (e) {
        console.warn('Could not configure forces:', e);
      }
    }
  }, [graphRef, data]);

  const handleNodeHover = (node: any) => {
    if (node) {
      // Use tracked mouse position
      setTooltipData({
        node,
        visible: true,
        x: mousePos.x,
        y: mousePos.y
      });
    } else {
      setTooltipData(prev => ({ ...prev, visible: false }));
    }
  };
  
  // Update tooltip position when mouse moves and a node is hovered
  useEffect(() => {
    if (tooltipData.visible && tooltipData.node) {
      setTooltipData(prev => ({
        ...prev,
        x: mousePos.x,
        y: mousePos.y
      }));
    }
  }, [mousePos]);

  // Calculate node size based on citations - BALANCED
  const getNodeSize = (node: any): number => {
    const citationCount = node.citedByCount || 0;
    // Balanced size
    // Min 5, max 18
    const baseSize = 5;
    const citationSize = Math.sqrt(citationCount) * 1;
    return Math.min(Math.max(baseSize + citationSize, 5), 18);
  };

  const getFitFontSize = (text: string): number => {
    // Simple base font size - NO zoom logic here!
    const baseFontSize = 12;
    
    // Only adjust for text length
    if (text.length > 25) return baseFontSize * 0.6;
    if (text.length > 20) return baseFontSize * 0.7;
    if (text.length > 15) return baseFontSize * 0.8;
    if (text.length > 10) return baseFontSize * 0.9;
    
    return baseFontSize;
  };

  console.log('🔄 Rendering ForceGraph2D:', { 
    nodes: data.nodes.length,
    links: data.links.length,
    width: dimensions.width, 
    height: dimensions.height 
  });

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#FAFAFA'
    }}>
      <ForceGraph2D
        ref={graphRef}
        graphData={data}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#FAFAFA"
        nodeLabel=""
        nodeColor={(node: any) => nodeColorFn(node.citedByCount || 0)}
        nodeRelSize={6}
        nodeVal={(node: any) => {
          // Node area based on citations - BALANCED
          const citations = node.citedByCount || 0;
          return Math.max(Math.sqrt(citations) * 1, 1);
        }}
        linkWidth={link => {
          // Stronger connections = thicker lines
          if (link.type === 'similar') {
            return 1 + (link.strength || 0.3) * 2 // Range: 1-3px
          }
          return getLinkWidth(link)
        }}
        linkColor={link => getLinkColor(link)}
        linkDirectionalParticles={(link: any) => {
          // Subtle particles only for very strong connections
          if (link.type === 'similar' && link.strength > 0.8) {
            return 2
          }
          return 0
        }}
        linkDirectionalParticleWidth={1.5}
        linkDirectionalParticleSpeed={() => 0.002}
        linkDirectionalParticleColor={(link: any) => {
          const strength = link.strength || 0.5
          const greyValue = Math.floor(180 - strength * 100)
          return `rgba(${greyValue}, ${greyValue}, ${greyValue}, 0.5)`
        }}
        onNodeClick={onNodeClick}
        onNodeHover={handleNodeHover}
        onLinkHover={() => {}} // Do nothing on link hover - don't stop simulation!
        nodePointerAreaPaint={(node: any, color: string, ctx: any, globalScale: number) => {
          // MASSIVE hover area that scales with zoom!
          const hoverRadius = 50 / globalScale; // Gets BIGGER when zoomed out
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, hoverRadius, 0, 2 * Math.PI, false);
          ctx.fill();
        }}
        cooldownTime={8000}
        cooldownTicks={300}
        warmupTicks={100}
        d3AlphaDecay={0.01}
        d3VelocityDecay={0.2}
        d3AlphaMin={0.001}
        linkCurvature={0.1}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          
          // Node size based on CITATIONS - MODERATE scaling
          const baseNodeSize = getNodeSize(node);
          
          // Moderate scaling
          let nodeSize = baseNodeSize;
          if (globalScale < 0.5) {
            // Zoomed way out - bigger nodes
            nodeSize = baseNodeSize / (globalScale * 0.6);
          } else if (globalScale < 1) {
            // Zoomed out - slightly bigger
            nodeSize = baseNodeSize / (globalScale * 0.8);
          } else if (globalScale > 2) {
            // Zoomed in - smaller nodes
            nodeSize = baseNodeSize / (globalScale * 0.5);
          }
          
          // Font size - divide by globalScale for automatic zoom handling
          const fontSize = getFitFontSize(label) / globalScale;
          ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
          
          // Draw node circle
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, nodeSize, 0, 2 * Math.PI, false);
          ctx.fillStyle = nodeColorFn(node.citedByCount || 0);
          ctx.fill();
          
          // White border - thicker when zoomed out
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = Math.max(1.5 / globalScale, 0.5);
          ctx.stroke();
          
          // Show labels except when REALLY zoomed out (viewing entire graph)
          const shouldShowLabel = globalScale > 0.03;
          
          if (shouldShowLabel) {
            const textWidth = ctx.measureText(label).width;
            const padding = 6 / globalScale;
            const bckgDimensions = [textWidth + padding * 2, fontSize + padding];
            
            // Label position: closer when zoomed in, further when zoomed out
            const labelOffsetY = globalScale > 4 ? nodeSize * 0.3 : nodeSize + (3 / globalScale);
            
            // Simple white background - NO SHADOWS, NO TRANSPARENCY
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(
              node.x! - bckgDimensions[0] / 2,
              node.y! + labelOffsetY,
              bckgDimensions[0],
              bckgDimensions[1]
            );
            
            // Text
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#1a1a1a';
            ctx.fillText(
              label,
              node.x!,
              node.y! + labelOffsetY + bckgDimensions[1] / 2
            );
          }
          
          // Show citation count when zoomed in close
          if (globalScale > 3 && node.citedByCount > 0) {
            const citationText = `${node.citedByCount}`;
            const citationFontSize = Math.min(nodeSize * 0.5, 12) / globalScale;
            ctx.font = `bold ${citationFontSize}px Inter, system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';
            ctx.fillText(citationText, node.x!, node.y!);
          }
        }}
      />
      
      <TaskTooltip
        node={tooltipData.node}
        visible={tooltipData.visible}
        x={tooltipData.x}
        y={tooltipData.y}
      />
    </div>
  );
};

export default GraphRenderer;
