<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200',
      badgeClasses
    ]"
  >
    <component :is="badgeIcon" class="w-3.5 h-3.5" />
    {{ displayName }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { Sparkles, Zap, Building2 } from 'lucide-vue-next'

const props = defineProps({
  plan: {
    type: String,
    default: 'FREE',
    validator: (value) => ['FREE', 'PRO', 'ENTERPRISE'].includes(value),
  },
})

const config = {
  FREE: {
    name: 'Plan Gratuito',
    classes: 'bg-neutral/15 text-neutral-light border-neutral/30',
    icon: Sparkles,
  },
  PRO: {
    name: 'Plan Pro',
    classes: 'bg-primary/15 text-primary-light border-primary/30',
    icon: Zap,
  },
  ENTERPRISE: {
    name: 'Plan Empresarial',
    classes: 'bg-warning/15 text-warning border-warning/30',
    icon: Building2,
  },
}

const displayName = computed(() => config[props.plan]?.name || props.plan)
const badgeClasses = computed(() => config[props.plan]?.classes || config.FREE.classes)
const badgeIcon = computed(() => config[props.plan]?.icon || Sparkles)
</script>
