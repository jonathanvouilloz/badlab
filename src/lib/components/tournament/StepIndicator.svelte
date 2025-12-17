<script lang="ts">
  interface Props {
    currentStep: number;
    class?: string;
  }

  let { currentStep, class: className = '' }: Props = $props();

  const steps = [
    { number: 1, label: 'Informations', shortLabel: 'Infos' },
    { number: 2, label: 'Participants', shortLabel: 'Joueurs' },
    { number: 3, label: 'Configuration', shortLabel: 'Config' },
    { number: 4, label: 'Validation', shortLabel: 'Valider' }
  ];
</script>

<ul class="steps steps-horizontal w-full {className}">
  {#each steps as step}
    <li
      class="step text-text-secondary"
      class:step-accent={currentStep >= step.number}
      class:text-accent={currentStep >= step.number}
      data-content={currentStep > step.number ? '✓' : step.number}
    >
      <span class="hidden md:inline text-small font-medium">{step.label}</span>
      <span class="md:hidden text-small font-medium">{step.shortLabel}</span>
    </li>
  {/each}
</ul>
