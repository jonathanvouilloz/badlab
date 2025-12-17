import { getContext, setContext } from 'svelte';
import { type WizardFormData, type WizardStep, defaultFormData } from './types';

const WIZARD_KEY = Symbol('wizard-context');

export type WizardContext = ReturnType<typeof createWizardContext>;

export function createWizardContext() {
  // State
  let currentStep = $state<WizardStep>(1);
  let formData = $state<WizardFormData>({ ...defaultFormData });
  let errors = $state<Record<string, string>>({});
  let isSubmitting = $state(false);

  const context = {
    // Getters
    get currentStep() {
      return currentStep;
    },
    get formData() {
      return formData;
    },
    get errors() {
      return errors;
    },
    get isSubmitting() {
      return isSubmitting;
    },

    // Setters
    set isSubmitting(value: boolean) {
      isSubmitting = value;
    },

    // Navigation
    nextStep() {
      if (currentStep < 4) {
        currentStep = (currentStep + 1) as WizardStep;
      }
    },

    prevStep() {
      if (currentStep > 1) {
        currentStep = (currentStep - 1) as WizardStep;
      }
    },

    goToStep(step: WizardStep) {
      currentStep = step;
    },

    // Form data
    updateFormData(updates: Partial<WizardFormData>) {
      formData = { ...formData, ...updates };
    },

    // Errors
    setError(field: string, message: string) {
      errors = { ...errors, [field]: message };
    },

    clearError(field: string) {
      const { [field]: _, ...rest } = errors;
      errors = rest;
    },

    clearAllErrors() {
      errors = {};
    },

    hasError(field: string): boolean {
      return field in errors;
    },

    getError(field: string): string | undefined {
      return errors[field];
    },

    // Validations par étape
    validateStep1(): boolean {
      context.clearAllErrors();
      let isValid = true;

      if (!formData.name || formData.name.trim().length < 3) {
        context.setError('name', 'Le nom doit contenir au moins 3 caractères');
        isValid = false;
      }

      if (!formData.startDate) {
        context.setError('startDate', 'La date est obligatoire');
        isValid = false;
      } else {
        const selectedDate = new Date(formData.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          context.setError('startDate', 'La date doit être aujourd\'hui ou dans le futur');
          isValid = false;
        }
      }

      return isValid;
    },

    validateStep2(): boolean {
      context.clearAllErrors();

      const validParticipants = formData.participants.filter(
        (p) => p.firstName.trim() && p.lastName.trim()
      );

      if (validParticipants.length < 4) {
        context.setError('participants', 'Minimum 4 participants avec prénom et nom remplis');
        return false;
      }

      // Vérifier chaque participant
      for (let i = 0; i < formData.participants.length; i++) {
        const p = formData.participants[i];
        if (!p.firstName.trim() && !p.lastName.trim()) {
          // Ligne vide, on ignore
          continue;
        }
        if (!p.firstName.trim()) {
          context.setError(`participant_${i}_firstName`, 'Prénom requis');
          return false;
        }
        if (!p.lastName.trim()) {
          context.setError(`participant_${i}_lastName`, 'Nom requis');
          return false;
        }
      }

      return true;
    },

    validateStep3(): boolean {
      // Pas de validation spéciale pour l'étape 3
      // Le seeding method a une valeur par défaut
      return true;
    },

    // Validation complète
    validateAll(): boolean {
      return context.validateStep1() && context.validateStep2() && context.validateStep3();
    },

    // Reset
    reset() {
      currentStep = 1;
      formData = { ...defaultFormData };
      errors = {};
      isSubmitting = false;
    },
  };

  setContext(WIZARD_KEY, context);
  return context;
}

export function getWizardContext(): WizardContext {
  const context = getContext<WizardContext>(WIZARD_KEY);
  if (!context) {
    throw new Error('WizardContext not found. Make sure to call createWizardContext() in a parent component.');
  }
  return context;
}
