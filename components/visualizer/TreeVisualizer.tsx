'use client';

import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  type NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { VisualizerState } from '@/lib/mock-data';

interface TreeVisualizerProps {
  state: VisualizerState;
}

function CustomNode({ data }: { data: { label: string; active: boolean } }) {
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 shadow-sm transition-all duration-300 ${
        data.active
          ? 'bg-brand-900 text-white border-brand-700 shadow-glow-teal scale-110'
          : 'bg-white text-gray-800 border-gray-200'
      }`}
    >
      {data.label}
    </div>
  );
}

const nodeTypes: NodeTypes = { custom: CustomNode };

export default function TreeVisualizer({ state }: TreeVisualizerProps) {
  const stateNodes = state.nodes ?? [];
  const stateEdges = state.edges ?? [];
  const activeNode = state.activeNode;

  const nodes: Node[] = stateNodes.map(n => ({
    id: n.id,
    position: { x: n.x, y: n.y },
    type: 'custom',
    data: { label: n.label, active: n.id === activeNode },
  }));

  const edges: Edge[] = stateEdges.map((e, i) => ({
    id: `e${i}`,
    source: e.source,
    target: e.target,
    style: { stroke: '#9ca3af', strokeWidth: 2 },
    animated: e.source === activeNode || e.target === activeNode,
  }));

  if (nodes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        No tree/graph data for this step
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        panOnDrag={false}
      >
        <Background color="#e5e7eb" gap={24} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
