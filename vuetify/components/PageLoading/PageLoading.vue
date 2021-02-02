<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <!-- <v-flex v-if="text" tag="h1" class="text-center headline pb-2">{{text}}</v-flex> -->
      <v-progress-circular
        color="primary"
        indeterminate
        v-bind="$props"
      ></v-progress-circular>
    </v-layout>
  </v-container>
</template>

<script lang="ts" src="./PageLoading.ts">
</script>


<style  scoped>
.loading-content {
  width: 100%;
  height: 100%;
}
</style>
