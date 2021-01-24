<template>
    <v-tooltip class="icon-tooltip" right max-width="220" content-class="icon-tooltip__content">
      <template v-slot:activator="{ on, attrs }" color="primary">
        <v-icon small color="grey darken-1" v-bind="attrs" v-on="on">
          {{icon}}
        </v-icon>
      </template>
      <span>
        <slot>
        </slot>
      </span>
    </v-tooltip>
</template>

<script lang="ts" src="./IconTooltip.ts"></script>

<style lang="scss" scoped>
  .icon-tooltip{
    &__content{
      display: inline-block;
      line-height: 1.35;
    }
  }
</style>