import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface CustomNodeData {
  label: string;
  description: string;
  cleanDescription: string;
  nodeType: string;
  group: string;
  isEntryPoint: boolean;
  aiNode: any;
}

const CustomAINode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
  const nodeType = data.nodeType || 'utility';
  
  // Color scheme for different AI-detected node types
  const colors: Record<string, string> = {
    function: '#4299e1',
    eventHandler: '#ed8936',
    pageElement: '#e53e3e',
    wixApi: '#805ad5',
    externalAPI: '#38a169',
    utility: '#718096',
    error: '#fc8181',
  };

  const icons: Record<string, string> = {
    function: '⚙️',
    eventHandler: '⚡',
    pageElement: '📱',
    wixApi: '🔌',
    externalAPI: '🌐',
    utility: '🔧',
    error: '❌',
  };

  const color = colors[nodeType] || colors.utility;
  const icon = icons[nodeType] || icons.utility;
  const isEntryPoint = data.isEntryPoint;

  return (
    <div
      style={{
        background: isEntryPoint 
          ? `linear-gradient(135deg, ${color}20, ${color}35, #48bb7820)` 
          : `linear-gradient(135deg, ${color}15, ${color}25)`,
        border: isEntryPoint 
          ? `3px solid ${color}` 
          : `2px solid ${color}`,
        borderRadius: '16px',
        padding: '16px',
        minWidth: '280px',
        maxWidth: '320px',
        minHeight: '120px',
        boxShadow: selected 
          ? `0 0 0 2px #3182ce, ${isEntryPoint ? `0 4px 16px ${color}40` : `0 2px 8px ${color}30`}`
          : isEntryPoint 
            ? `0 4px 16px ${color}40, 0 2px 8px #48bb7830` 
            : `0 2px 8px ${color}30`,
        position: 'relative',
      }}
    >
      {/* Title Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: `1px solid ${color}40`,
      }}>
        <span style={{ marginRight: '8px', fontSize: '16px' }}>{icon}</span>
        <span style={{ 
          color: color, 
          fontWeight: 'bold', 
          fontSize: '14px',
          flex: 1 
        }}>
          {data.aiNode?.label || 'Function'}
        </span>
        {isEntryPoint && (
          <span style={{ 
            backgroundColor: '#48bb78', 
            color: 'white', 
            padding: '3px 8px', 
            borderRadius: '12px', 
            fontSize: '10px',
            fontWeight: 'bold'
          }}>
            ENTRY
          </span>
        )}
      </div>

      {/* Description Section - Main Content */}
      <div style={{
        fontSize: '12px',
        lineHeight: '1.4',
        color: '#2d3748',
        fontWeight: 'normal',
        textAlign: 'left',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical' as any,
      }}>
        {data.cleanDescription || data.description || 'No description available'}
      </div>

      {/* Group Badge */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        backgroundColor: `${color}20`,
        color: color,
        padding: '2px 6px',
        borderRadius: '8px',
        fontSize: '9px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
      }}>
        {data.group?.split(' ')[0] || 'Other'}
      </div>

      {/* React Flow Handles */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: color,
          border: `2px solid white`,
          width: '10px',
          height: '10px',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: color,
          border: `2px solid white`,
          width: '10px',
          height: '10px',
        }}
      />
    </div>
  );
};

export default CustomAINode; 