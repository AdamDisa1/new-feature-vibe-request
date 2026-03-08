import { Node, Edge, MarkerType } from 'reactflow';
import { AIParseResult } from './aiParser';

export interface AIGraphData {
  nodes: Node[];
  edges: Edge[];
}

// Color scheme for different AI-detected node types
const AI_NODE_COLORS = {
  function: '#4299e1',      // Blue for functions
  eventHandler: '#ed8936',  // Orange for event handlers
  pageElement: '#e53e3e',   // Red for page elements
  wixApi: '#805ad5',        // Purple for Wix APIs
  externalAPI: '#38a169',   // Green for external APIs
  utility: '#718096',       // Gray for utility functions
  error: '#fc8181',         // Light red for errors
};

const AI_NODE_ICONS = {
  function: '⚙️',
  eventHandler: '⚡',
  pageElement: '📱',
  wixApi: '🔌',
  externalAPI: '🌐',
  utility: '🔧',
  error: '❌',
};

export function createAIGraphData(aiResult: AIParseResult): AIGraphData {
  // Convert AI nodes to React Flow nodes
  const nodes: Node[] = aiResult.nodes.map((aiNode, index) => {
    const nodeType = aiNode.type || 'utility';
    const color = AI_NODE_COLORS[nodeType as keyof typeof AI_NODE_COLORS] || AI_NODE_COLORS.utility;
    const icon = AI_NODE_ICONS[nodeType as keyof typeof AI_NODE_ICONS] || AI_NODE_ICONS.utility;

    // Check if this is an entry point
    const isEntryPoint = aiNode.description?.includes('[ENTRY POINT]') || aiNode.description?.includes('ENTRY POINT');
    
    // Clean description by removing [ENTRY POINT] markers for display
    const cleanDescription = aiNode.description?.replace(/\*\*\[ENTRY POINT\]\*\*/g, '').replace(/\[ENTRY POINT\]/g, '').trim();

    // Create multi-line label with title and description
    const entryBadge = isEntryPoint ? ' 🚀' : '';
    const titleLine = `${icon} ${aiNode.label}${entryBadge}`;
    const descriptionText = cleanDescription || 'No description available';
    
    return {
      id: aiNode.id,
      type: 'customAI',
      position: { x: 0, y: 0 }, // Will be set by layout
      data: {
        label: titleLine,
        description: aiNode.description,
        cleanDescription: descriptionText,
        nodeType: nodeType,
        group: aiNode.group,
        aiNode: aiNode,
        isEntryPoint: isEntryPoint,
      },
      className: `ai-node ai-${nodeType} ${isEntryPoint ? 'entry-point' : ''}`,
    };
  });

  // Convert AI edges to React Flow edges
  const edges: Edge[] = aiResult.edges.map((aiEdge, index) => {
    return {
      id: `${aiEdge.source}-${aiEdge.target}-${index}`,
      source: aiEdge.source,
      target: aiEdge.target,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#3182ce', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#3182ce',
      },
      label: aiEdge.label || '',
      labelStyle: {
        fontSize: '11px',
        fontWeight: 'bold',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '2px 6px',
        borderRadius: '4px',
      },
    };
  });

  // Apply group-based layout
  const { layoutedNodes, groupBackgrounds } = autoLayoutNodesByGroups(nodes, edges);

  return { nodes: [...groupBackgrounds, ...layoutedNodes], edges };
}

// Auto-layout algorithm for group-based node organization
export function autoLayoutNodesByGroups(nodes: Node[], edges: Edge[]): { layoutedNodes: Node[], groupBackgrounds: Node[] } {
  if (nodes.length === 0) {
    return { layoutedNodes: nodes, groupBackgrounds: [] };
  }

  // Group nodes by their group property
  const nodesByGroup = new Map<string, Node[]>();
  nodes.forEach(node => {
    const group = node.data.group || 'Utilities';
    if (!nodesByGroup.has(group)) {
      nodesByGroup.set(group, []);
    }
    nodesByGroup.get(group)!.push(node);
  });

  const groupBackgrounds: Node[] = [];
  const layoutedNodes: Node[] = [];
  
  // Layout configuration
  const nodeSpacing = { x: 400, y: 180 };
  const groupPadding = 60;
  let currentX = 60;

  // Process each group
  Array.from(nodesByGroup.entries()).forEach(([groupName, groupNodes], groupIndex) => {
    const startX = currentX;
    const startY = 50;
    
    // Position nodes in this group
    groupNodes.forEach((node, nodeIndex) => {
      const row = Math.floor(nodeIndex / 2);
      const col = nodeIndex % 2;
      
      node.position = {
        x: startX + col * nodeSpacing.x,
        y: startY + row * nodeSpacing.y
      };
      
      layoutedNodes.push(node);
    });

    // Calculate group background dimensions
    const maxRow = Math.ceil(groupNodes.length / 2);
    const groupWidth = Math.max(nodeSpacing.x + 320, groupNodes.length > 1 ? nodeSpacing.x + 320 : 400);
    const groupHeight = maxRow * nodeSpacing.y + 120;

    // Create group background
    const groupColor = getGroupColor(groupName);
    groupBackgrounds.push({
      id: `group-${groupIndex}`,
      type: 'default',
      position: { 
        x: startX - groupPadding, 
        y: startY - groupPadding 
      },
      data: { 
        label: `${groupName} (${groupNodes.length})` 
      },
      style: {
        width: groupWidth + groupPadding * 2,
        height: groupHeight + groupPadding,
        backgroundColor: `${groupColor}10`,
        border: `2px dashed ${groupColor}60`,
        borderRadius: '16px',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10px',
        fontSize: '14px',
        fontWeight: 'bold',
        color: groupColor,
      },
      selectable: false,
      draggable: false,
    });

    currentX += groupWidth + groupPadding * 2 + 80;
  });

  return { layoutedNodes, groupBackgrounds };
}

function getGroupColor(groupName: string): string {
  const colorMap: Record<string, string> = {
    'Page Functions': '#4299e1',
    'Event Handlers': '#ed8936',
    'Page Elements': '#e53e3e',
    'Wix APIs': '#805ad5',
    'External APIs': '#38a169',
    'External Services': '#38a169',
    'Utilities': '#718096',
    'Errors': '#fc8181',
  };
  
  return colorMap[groupName] || '#718096';
}

export function recalculateAILayout(nodes: Node[], edges: Edge[]): Node[] {
  const { layoutedNodes } = autoLayoutNodesByGroups(
    nodes.filter(node => !node.id.startsWith('group-')), 
    edges
  );
  return layoutedNodes;
}

export function validateAndFixOverlaps(nodes: Node[]): Node[] {
  // Simple overlap detection and resolution
  const fixedNodes = [...nodes];
  
  for (let i = 0; i < fixedNodes.length; i++) {
    for (let j = i + 1; j < fixedNodes.length; j++) {
      const nodeA = fixedNodes[i];
      const nodeB = fixedNodes[j];
      
      if (nodeA.id.startsWith('group-') || nodeB.id.startsWith('group-')) continue;
      
      const distance = Math.sqrt(
        Math.pow(nodeA.position.x - nodeB.position.x, 2) + 
        Math.pow(nodeA.position.y - nodeB.position.y, 2)
      );
      
      if (distance < 150) {
        // Move nodeB away from nodeA
        nodeB.position.x += 180;
      }
    }
  }
  
  return fixedNodes;
} 