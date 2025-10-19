"use client";

import React from 'react';
import { ZoomIn, ZoomOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GraphControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

const GraphControls = ({ onZoomIn, onZoomOut, onResetView }: GraphControlsProps) => {
  return (
    <div className="absolute left-4 bottom-4 z-10 flex flex-col gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm border">
      <Button variant="outline" size="icon" onClick={onZoomIn} title="Zoom In">
        <ZoomIn size={16} />
      </Button>
      <Button variant="outline" size="icon" onClick={onZoomOut} title="Zoom Out">
        <ZoomOut size={16} />
      </Button>
      <Button variant="outline" size="icon" onClick={onResetView} title="Reset View">
        <Home size={16} />
      </Button>
    </div>
  );
};

export default GraphControls;
