<template>
  <div class="page-header">
    <div class="page-header__left">
      <slot name="left">
        <div class="page-header__breadcrumbs mb-1">
          <slot name="breadcrumbs"></slot>
        </div>
        <h1 class="text-h1">{{title}}</h1>
      </slot> 
    </div>   
    <v-spacer/>
    <div class="page-header__right">
      <slot name="right"></slot>
    </div>  
  </div>  
</template>

<script lang="ts" src="./PageHeader.ts">
</script>

<style lang="scss" scoped>
  .page-header{
    display: flex;
    align-items: center;

    &__breadcrumbs a{
      text-decoration: none;
    }

    &__right{
      text-align: right;
    }
  }
</style>