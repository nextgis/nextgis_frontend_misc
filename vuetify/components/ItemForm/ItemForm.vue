<template>
  <v-form v-model="valid">
    <template v-for="(f, i) in fields">
      <v-text-field :key="i" v-model="item[f.name]" v-bind="getFieldProps(f)">
      </v-text-field>
    </template>
  </v-form>
</template>

<script lang="ts" src="./ItemForm.ts">
</script>

<style lang="css" scoped>
</style>
