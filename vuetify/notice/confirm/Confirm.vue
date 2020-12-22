<template>
  <v-dialog
    eager
    @input="change"
    value="true"
    :max-width="width"
    :persistent="persistent"
    @keydown.esc="choose(false)"
  >
    <v-card tile>
      <v-toolbar v-if="Boolean(title)" dark :color="color" dense flat>
        <v-icon v-if="Boolean(icon)" left>{{ icon }}</v-icon>
        <v-toolbar-title class="white--text" v-text="title" />
      </v-toolbar>
      <v-card-text class="body-1 text-body-1 py-3" v-html="message" />
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="Boolean(buttonFalseText)"
          :color="buttonFalseColor"
          :text="buttonFalseFlat"
          @click="choose(false)"
        >
          {{ buttonFalseText }}
        </v-btn>
        <v-btn
          v-if="Boolean(buttonTrueText)"
          :color="buttonTrueColor"
          :text="buttonTrueFlat"
          @click="choose(true)"
        >
          {{ buttonTrueText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script lang="ts" src="./Confirm.ts">
</script>