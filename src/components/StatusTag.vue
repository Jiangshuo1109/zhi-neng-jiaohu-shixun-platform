<template>
  <span class="status-tag" :class="statusClass[status]">{{ statusLabel[status] }}</span>
</template>

<script setup lang="ts">
import { statusLabel, statusClass, type SlotStatus } from '@/mock/bookings'

defineProps<{ status: SlotStatus }>()
</script>
