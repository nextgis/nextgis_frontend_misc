<template>
  <v-form v-model="valid">
    <template v-for="(f, i) in fields">
      <slot
        v-if="hasSlot(f)"
        :name="'field.' + f.name"
        v-bind:field="f"
        v-bind:attrs="getFieldProps(f)"
        v-bind:item="item"
      >
      </slot>
      <v-text-field
        v-else
        :key="i"
        v-model="item[f.name]"
        v-bind="getFieldProps(f)"
      >
      </v-text-field>
    </template>
  </v-form>
</template>

<script lang="ts" src="./ItemForm.ts">
</script>

<style lang="css" scoped>
</style>
