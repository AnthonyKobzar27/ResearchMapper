"use client";

import React from 'react';

interface TaskTooltipProps {
  node: any;
  visible: boolean;
  x: number;
  y: number;
}

const TaskTooltip = ({ node, visible, x, y }: TaskTooltipProps) => {
  if (!visible || !node) return null;

  return (
    <div 
      style={{ 
        position: 'fixed',
        left: '20px',
        bottom: '20px',
        maxWidth: '320px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #000000',
        borderRadius: '8px',
        padding: '14px 16px',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '13px',
        zIndex: 100,
        pointerEvents: 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
    >
      <div style={{ 
        fontWeight: 600,
        marginBottom: '6px',
        color: '#000000',
        lineHeight: '1.4'
      }}>
        {node.name}
      </div>
      <div style={{ 
        fontSize: '12px',
        color: '#666666'
      }}>
        {node.citedByCount !== undefined ? `${node.citedByCount} citations` : 'No citation data'}
      </div>
    </div>
  );
};

export default TaskTooltip;