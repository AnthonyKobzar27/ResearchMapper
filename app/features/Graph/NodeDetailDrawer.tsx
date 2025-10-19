"use client";

import React from 'react';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText,
  Calendar,
  Quote,
  ExternalLink,
  X,
  TrendingUp,
  BookOpen,
  Users
} from 'lucide-react';

interface NodeDetailDrawerProps {
  selectedNode: any | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const NodeDetailDrawer = ({ selectedNode, isOpen, onOpenChange }: NodeDetailDrawerProps) => {
  if (!selectedNode) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-2xl mx-auto h-[90vh]">
        <DrawerHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-8">
              <DrawerTitle className="text-2xl font-bold leading-tight mb-2">
                {selectedNode.title || selectedNode.name}
              </DrawerTitle>
              <DrawerDescription className="flex items-center gap-3 mt-3 flex-wrap">
                {selectedNode.year && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {selectedNode.year}
                  </Badge>
                )}
                {selectedNode.citedByCount !== undefined && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Quote className="h-3 w-3" />
                    {selectedNode.citedByCount} citations
                  </Badge>
                )}
                {selectedNode.referenceCount !== undefined && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {selectedNode.referenceCount} references
                  </Badge>
                )}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="px-6 pb-6 space-y-6 overflow-y-auto">
          
          {/* Authors */}
          {selectedNode.authors && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                  Authors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedNode.authors}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Impact Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Impact Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Quote className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-700">
                    {selectedNode.citedByCount || 0}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">Citations</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">
                    {selectedNode.referenceCount || 0}
                  </div>
                  <div className="text-xs text-green-600 mt-1">References</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-700">
                    {selectedNode.influence || 0}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">Influence Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Concepts/Topics */}
          {selectedNode.concepts && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  Research Concepts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.concepts.split(',').map((concept: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-sm">
                      {concept.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* DOI and Links */}
          {(selectedNode.doi || selectedNode.url) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ExternalLink className="h-5 w-5 text-orange-600" />
                  Access Paper
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedNode.doi && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1">DOI</div>
                      <div className="text-sm font-mono text-gray-700">{selectedNode.doi}</div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`https://doi.org/${selectedNode.doi}`, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open
                    </Button>
                  </div>
                )}
                {selectedNode.url && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="text-xs font-medium text-gray-500 mb-1">Full Text</div>
                      <div className="text-sm text-gray-700 truncate">{selectedNode.url}</div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(selectedNode.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Network Information */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">Network Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-blue-100">
                  <span className="text-gray-600">Paper ID</span>
                  <span className="font-mono text-gray-900 text-xs">{selectedNode.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-blue-100">
                  <span className="text-gray-600">Publication Year</span>
                  <span className="font-semibold text-gray-900">{selectedNode.year || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Total Connections</span>
                  <span className="font-semibold text-gray-900">
                    {(selectedNode.citedByCount || 0) + (selectedNode.referenceCount || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NodeDetailDrawer;
