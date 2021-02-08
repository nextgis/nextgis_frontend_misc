<template>
  <v-autocomplete
    v-model="select"
    :loading="isLoading"
    :items="items"
    :search-input.sync="query"
    :hide-details="hideDetails"
    :dense="dense"
    :outlined="outlined"
    :label="label"
    :placeholder="placeholder"
    :prepend-inner-icon="prependInnerIcon"
    v-bind="$attrs"
  ></v-autocomplete>
</template>

<script lang="ts" src="./GeocoderInput.ts">
</script>


<style lang="scss" scoped>

</style>
