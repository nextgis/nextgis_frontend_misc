<template>
  <div class="page-header">
    <slot name="left">
      <h1 class="text-h1">{{title}}</h1>
    </slot>  
    <v-spacer/>
    <slot name="right"></slot>
  </div>  
</template>

<script lang="ts" src="./PageHeader.ts">
</script>

<style lang="scss" scoped>
  .page-header{
    display: flex;
    align-items: center;
  }
</style>