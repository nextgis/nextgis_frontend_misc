<template>
  <v-input
    v-model="localGeom"
    :label="label"
    :messages="messages"
    :success="success"
    :success-messages="successMsg"
    :error="error"
    :error-messages="errorMsg"
    :hide-details="hideDetails"
    :error-count="errorCount"
    :hint="hint"
    :persistent-hint="persistentHint"
    :append-icon="appendIcon"
    :prepend-icon="prependIcon"
    :height="height"
    :rules="rules"
    @click:append="appendIconCallback"
    @click:prepend="prependIconCallback"
  >
    <VueNgwLeafletEditable
      v-if="mapOptionsLocale"
      v-model="localGeom"
      :enabled="enabled"
      :mapOptions="mapOptionsLocale"
      full-filling
      class="map"
    >
      <slot name="map"></slot>
    </VueNgwLeafletEditable>
  </v-input>
</template>

<script lang="ts" src="./GeomInput.ts">
</script>

<style lang="css" scoped>
</style>
