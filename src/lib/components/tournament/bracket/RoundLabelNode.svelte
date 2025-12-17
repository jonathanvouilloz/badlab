<script lang="ts">
  import type { RoundLabelNodeData } from './types';

  interface Props {
    id: string;
    data: RoundLabelNodeData;
  }

  let { id, data }: Props = $props();
</script>

<div class="w-[220px] text-center py-2">
  <span class="text-sm font-semibold text-text-primary">{data.name}</span>
  <span class="text-xs text-text-muted ml-1">
    ({data.matchCount} {data.matchCount > 1 ? 'matchs' : 'match'})
  </span>
</div>
