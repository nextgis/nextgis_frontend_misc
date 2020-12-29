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
      <v-datetime-picker
        v-else-if="f.widget && f.widget === 'datetime'"
        :key="f.name"
        v-model="item[f.name]"
        :textFieldProps="getFieldProps(f)"
        v-bind="getFieldProps(f)"
      ></v-datetime-picker>
      <!-- <v-row v-else-if="f.widget && f.widget === 'datetime'" :key="f.name">
        <v-col>
          <v-menu
            :ref="`menu-${f.value}`"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                :value="getFieldValue(f)"
                :append-icon="icons.calendar"
                :persistent-hint="false"
                v-bind="getFieldProps(f)"
                v-on="on"
                @change="(val) => setFieldValue(f, val)"
                @click:append="
                  $refs[`menu-${f.value}`][0].isActive = !$refs[
                    `menu-${f.value}`
                  ][0].isActive
                "
              ></v-text-field>
            </template>
            <v-date-picker
              :value="parseDateFromFieldValue(item[f.name])"
              no-title
              scrollable
              @change="
                (val) => {
                  setFieldValue(f, val);
                  $refs[`menu-${f.value}`][0].isActive = false;
                }
              "
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="$refs[`menu-${f.value}`][0].isActive = false"
                >{{meta.messages.close || 'Close'}}</v-btn
              >
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col>time</v-col>
      </v-row> -->
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
