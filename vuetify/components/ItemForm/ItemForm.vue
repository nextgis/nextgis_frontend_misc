<template>
  <v-form v-model="valid" ref="ItemForm">
    <v-row v-for="(cols, i) in rows" :key="i" class="my-0 py-0 item-form-row">
      <v-col
        v-for="f in cols"
        :key="f.name"
        v-bind:class="['my-0', 'py-0' ,'item-form-col',f.name, f.class ? f.class : '']"
      >
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
          :okText="messages_.okText"
          :clearText="messages_.clear_text || 'Clear'"
          v-model="item[f.name]"
          v-bind="getFieldProps(f)"
        ></DatetimePicker>
        <PasswordField
          v-else-if="f.widget && f.widget === 'password'"
          :key="f.name"
          v-model="item[f.name]"
          v-bind="getFieldProps(f)"
        ></PasswordField>
        <v-checkbox
          v-else-if="f.type === 'boolean'"
          :key="f.name"
          v-bind="getFieldProps(f)"
          v-model="item[f.name]"
        >
        </v-checkbox>
        <v-select
          v-else-if="f.choices && f.widget && f.widget === 'select'"
          :key="f.name"
          :items="f.choices"
          v-model="item[f.name]"
          v-bind="getFieldProps(f)"
        ></v-select>
        <v-text-field
          v-else
          :key="f.name"
          v-model="item[f.name]"
          v-bind="getFieldProps(f)"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <slot v-bind:valid="valid"></slot>
  </v-form>
</template>

<script lang="ts" src="./ItemForm.ts">
</script>

<style lang="css" scoped>
</style>
