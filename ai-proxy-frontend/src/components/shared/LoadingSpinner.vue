<template>
  <div class="flex flex-col items-center justify-center gap-3 py-6">
    <div class="relative">
      <!-- Outer glow ring -->
      <div class="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
      <!-- Spinner circle -->
      <svg
        class="w-10 h-10 animate-spin text-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="3"
        />
        <path
          class="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>
    <p class="text-sm text-text-secondary animate-pulse">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Generando respuesta...',
  },
})
</script>
