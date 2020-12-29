<template>
  <v-form v-model="valid">
    <template v-for="f in fields">
      <slot
        v-if="hasSlot(f)"
        :name="'field.' + f.name"
        v-bind:field="f"
        v-bind:attrs="getFieldProps(f)"
        v-bind:item="item"
      >
      </slot>
      <DatetimePicker
        v-else-if="f.widget && f.widget === 'datetime'"
        :key="f.name"
        :textFieldProps="getFieldProps(f)"
        :okText="meta.messages.ok_text || 'Ok'"
        :clearText="meta.messages.clear_text || 'Clear'"
        v-model="item[f.name]"
        v-bind="getFieldProps(f)"
      ></DatetimePicker>
      <v-text-field
        v-else
        :key="f.name"
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
