<template>
  <v-text-field
    v-model="value"
    v-bind="$attrs"
    :type="showPassword ? 'text' : 'password'"
    :append-icon="appendIcon"
    @click:append="showPassword = !showPassword"
  >
  </v-text-field>
</template>

<script lang="ts" src="./PasswordField.ts">
</script>

<style lang="css" scoped>
</style>
