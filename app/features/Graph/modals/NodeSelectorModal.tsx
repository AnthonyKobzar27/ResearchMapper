"use client";

import React from 'react';
import { X, ExternalLink, Calendar, Quote, FileText, Users, TrendingUp } from 'lucide-react';

interface NodeSelectorModalProps {
  node: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const NodeSelectorModal = ({ node, isOpen, onClose }: NodeSelectorModalProps) => {
  if (!isOpen || !node) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '500px',
        height: '100vh',
        backgroundColor: '#FFFFFF',
        border: '1px solid #000000',
        borderTop: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.3s ease-out',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '24px',
        borderBottom: '1px solid #000000',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF'
      }}>
        <div style={{ flex: 1, paddingRight: '16px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#000000',
            marginBottom: '12px',
            lineHeight: '1.3'
          }}>
            {node.title || node.name}
          </h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {node.year && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                backgroundColor: '#F5F5F5',
                color: '#000000',
                border: '1px solid #E0E0E0',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                <Calendar size={12} />
                {node.year}
              </span>
            )}
            {node.citedByCount !== undefined && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                backgroundColor: '#000000',
                color: '#FFFFFF',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                <Quote size={12} />
                {node.citedByCount} citations
              </span>
            )}
            {node.referenceCount !== undefined && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                backgroundColor: '#F5F5F5',
                color: '#000000',
                border: '1px solid #E0E0E0',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                <FileText size={12} />
                {node.referenceCount} refs
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <X size={20} color="#000000" />
        </button>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px'
      }}>
        
        {/* Authors */}
        {node.authors && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <Users size={16} color="#000000" />
              <h3 style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#000000',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Authors
              </h3>
            </div>
            <p style={{
              fontSize: '14px',
              color: '#666666',
              lineHeight: '1.6',
              paddingLeft: '24px'
            }}>
              {node.authors}
            </p>
          </div>
        )}

        {/* Impact Metrics */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <TrendingUp size={16} color="#000000" />
            <h3 style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#000000',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Impact Metrics
            </h3>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            paddingLeft: '24px'
          }}>
            <div style={{
              padding: '16px',
              backgroundColor: '#F9F9F9',
              border: '1px solid #E0E0E0',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000' }}>
                {node.citedByCount || 0}
              </div>
              <div style={{ fontSize: '11px', color: '#666666', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Citations
              </div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#F9F9F9',
              border: '1px solid #E0E0E0',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000' }}>
                {node.referenceCount || 0}
              </div>
              <div style={{ fontSize: '11px', color: '#666666', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                References
              </div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#F9F9F9',
              border: '1px solid #E0E0E0',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000' }}>
                {node.influence || 0}
              </div>
              <div style={{ fontSize: '11px', color: '#666666', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Influence
              </div>
            </div>
          </div>
        </div>

        {/* Concepts */}
        {node.concepts && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <FileText size={16} color="#000000" />
              <h3 style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#000000',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Research Concepts
              </h3>
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              paddingLeft: '24px'
            }}>
              {node.concepts.split(',').map((concept: string, idx: number) => (
                <span
                  key={idx}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#F5F5F5',
                    color: '#000000',
                    border: '1px solid #E0E0E0',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  {concept.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {(node.doi || node.url || node.semanticScholarUrl) && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <ExternalLink size={16} color="#000000" />
              <h3 style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#000000',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Access Paper
              </h3>
            </div>
            <div style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {node.url && (
                <a
                  href={node.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    backgroundColor: '#000000',
                    border: 'none',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#333333';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#000000';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span>Open Full Text</span>
                  <ExternalLink size={16} />
                </a>
              )}
              {node.doi && (
                <a
                  href={`https://doi.org/${node.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #000000',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#000000',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F5F5F5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  <span>View via DOI</span>
                  <ExternalLink size={16} color="#000000" />
                </a>
              )}
              {node.semanticScholarUrl && (
                <a
                  href={node.semanticScholarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#666666',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F5F5F5';
                    e.currentTarget.style.borderColor = '#000000';
                    e.currentTarget.style.color = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#E0E0E0';
                    e.currentTarget.style.color = '#666666';
                  }}
                >
                  <span>View on Semantic Scholar</span>
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Paper ID */}
        <div style={{
          padding: '16px',
          backgroundColor: '#F9F9F9',
          border: '1px solid #E0E0E0',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#666666'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '4px', color: '#000000' }}>Paper ID</div>
          <div style={{ fontFamily: 'monospace', fontSize: '11px', wordBreak: 'break-all' }}>
            {node.id}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeSelectorModal;
