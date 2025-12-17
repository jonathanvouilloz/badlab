<script lang="ts">
  import {
    SvelteFlow,
    Controls,
    MiniMap,
    Background,
    BackgroundVariant
  } from '@xyflow/svelte';
  import type { Node } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';

  import type { BracketData, BracketMatch, MatchNode, BracketEdge } from './types';
  import {
    calculateBracketLayout,
    getMatchPath,
    getPathEdges
  } from './utils/layoutCalculator';
  import MatchNodeComponent from './MatchNode.svelte';
  import RoundLabelNode from './RoundLabelNode.svelte';
  import MatchDrawer from './MatchDrawer.svelte';

  interface Props {
    bracket: BracketData;
    isOrganizer?: boolean;
    onMatchClick?: (match: BracketMatch) => void;
  }

  let { bracket, isOrganizer = false, onMatchClick }: Props = $props();

  // Custom node types for Svelte Flow
  const nodeTypes = {
    match: MatchNodeComponent,
    roundLabel: RoundLabelNode
  };

  // Calculate initial layout from bracket data
  let initialLayout = calculateBracketLayout(bracket.rounds, isOrganizer);

  // Use $state.raw for Svelte Flow (as per docs, for performance)
  let nodes = $state.raw<Node[]>(initialLayout.nodes);
  let edges = $state.raw<BracketEdge[]>(initialLayout.edges);

  // Update nodes/edges when bracket data changes
  $effect(() => {
    const newLayout = calculateBracketLayout(bracket.rounds, isOrganizer);
    nodes = newLayout.nodes;
    edges = newLayout.edges;
  });

  // Drawer state
  let drawerMatch = $state<BracketMatch | null>(null);
  let drawerOpen = $state(false);

  // Hover highlighting state
  let hoveredNodeId = $state<string | null>(null);

  // Handle node click - @xyflow/svelte passes { node, event } directly
  function handleNodeClick({ node, event }: { node: Node; event: MouseEvent | TouchEvent }) {
    // Skip label nodes
    if (node?.type === 'roundLabel') return;

    const matchNode = node as MatchNode;
    if (matchNode?.data?.match) {
      const match = matchNode.data.match;

      // Organizer with valid match -> open score modal
      if (
        isOrganizer &&
        match.participant1Id &&
        match.participant2Id &&
        match.status !== 'walkover' &&
        onMatchClick
      ) {
        onMatchClick(match);
      } else {
        // Non-organizer or invalid match -> open drawer for details
        drawerMatch = match;
        drawerOpen = true;
      }
    }
  }

  // Handle node hover for path highlighting
  function handleNodePointerEnter({ node, event }: { node: Node; event: PointerEvent }) {
    // Skip label nodes
    if (node?.type === 'roundLabel') return;

    if (node) {
      hoveredNodeId = node.id;
      updateHighlighting(node.id);
    }
  }

  function handleNodePointerLeave({ node, event }: { node: Node; event: PointerEvent }) {
    // Skip label nodes
    if (node?.type === 'roundLabel') return;

    hoveredNodeId = null;
    clearHighlighting();
  }

  function updateHighlighting(nodeId: string) {
    const { ancestors, descendants } = getMatchPath(nodeId, bracket.rounds);
    const pathNodeIds = new Set([nodeId, ...ancestors, ...descendants]);

    // Get edges that are part of the path
    const pathEdgeIds = getPathEdges(nodeId, bracket.rounds, edges);

    // Update nodes with highlighting (skip label nodes)
    nodes = nodes.map((node) => {
      if (node.type === 'roundLabel') return node;
      return {
        ...node,
        data: {
          ...node.data,
          isHighlighted: pathNodeIds.has(node.id),
          isDimmed: !pathNodeIds.has(node.id)
        }
      };
    });

    // Update edges with highlighting
    edges = edges.map((edge) => {
      const isInPath = pathEdgeIds.has(edge.id);
      return {
        ...edge,
        animated: isInPath,
        style: isInPath
          ? 'stroke: #10b981; stroke-width: 3px;'
          : 'stroke: #94a3b8; stroke-width: 2px; opacity: 0.3;'
      };
    });
  }

  function clearHighlighting() {
    // Update nodes (skip label nodes)
    nodes = nodes.map((node) => {
      if (node.type === 'roundLabel') return node;
      return {
        ...node,
        data: {
          ...node.data,
          isHighlighted: false,
          isDimmed: false
        }
      };
    });

    edges = edges.map((edge) => ({
      ...edge,
      animated: false,
      style: 'stroke: #94a3b8; stroke-width: 2px;'
    }));
  }

  function handleDrawerClose() {
    drawerOpen = false;
    drawerMatch = null;
  }
</script>

<div class="w-full h-[600px] relative bg-gray-50 rounded-lg overflow-hidden">
  <SvelteFlow
    bind:nodes
    bind:edges
    {nodeTypes}
    fitView
    fitViewOptions={{ padding: 0.2 }}
    nodesDraggable={false}
    nodesConnectable={false}
    elementsSelectable={true}
    panOnDrag={true}
    zoomOnScroll={true}
    minZoom={0.25}
    maxZoom={2}
    onnodeclick={handleNodeClick}
    onnodepointerenter={handleNodePointerEnter}
    onnodepointerleave={handleNodePointerLeave}
  >
    <Controls position="bottom-left" showInteractive={false} />
    <MiniMap
      position="bottom-right"
      pannable
      zoomable
      style="background: white; border: 1px solid #e2e8f0; border-radius: 8px;"
    />
    <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />
  </SvelteFlow>
</div>

<!-- Match Details Drawer -->
<MatchDrawer bind:open={drawerOpen} match={drawerMatch} onclose={handleDrawerClose} />
