<template>
  <v-snackbar
    :timeout="timeout"
    :color="color"
    v-model="value"
    @click="dismiss"
    @keydown.esc="dismiss"
  >
    <v-icon
      left
      v-if="Boolean(icon)">
      {{ icon }}
    </v-icon>
    {{message}}
  </v-snackbar>
</template>


<script lang="ts" src="./Notice.ts">
</script>