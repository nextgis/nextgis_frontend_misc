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
      <v-toolbar v-if="Boolean(title)" :color="color" dense flat>
        <v-icon v-if="Boolean(icon)" left>{{ icon }}</v-icon>
        <v-toolbar-title class="white--text" v-text="title" />
      </v-toolbar>
      <v-card-text class="body-1 text-body-1 py-3">
        <p v-if="message" v-html="message" />
        <ItemForm :fields="fields" v-model="item"></ItemForm>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="Boolean(buttonCancelText)"
          :color="buttonCancelColor"
          :text="buttonCancelFlat"
          @click="choose(false)"
        >
          {{ buttonCancelText }}
        </v-btn>
        <v-btn
          v-if="Boolean(buttonApplyText)"
          :color="buttonApplyColor"
          :text="buttonApplyFlat"
          @click="choose(true)"
        >
          {{ buttonApplyText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>



<script>
import {
  VCard,
  VCardActions,
  VCardText,
  VDialog,
  VIcon,
  VToolbar,
  VToolbarTitle,
  VSpacer,
  VBtn,
} from 'vuetify/lib';
import { ItemForm } from '../../components/ItemForm';
export default {
  components: {
    ItemForm,
    VCard,
    VCardActions,
    VCardText,
    VDialog,
    VIcon,
    VToolbar,
    VToolbarTitle,
    VSpacer,
    VBtn,
  },
  props: {
    fields: {
      required: true,
      type: Array,
    },
    item: {
      type: Object,
      required: true,
    },
    buttonApplyText: {
      type: String,
      default: 'Apply',
    },
    buttonCancelText: {
      type: String,
      default: 'Cancel',
    },
    buttonApplyColor: {
      type: String,
      default: 'primary',
    },
    buttonCancelColor: {
      type: String,
      default: 'primary',
    },
    buttonCancelFlat: {
      type: Boolean,
      default: true,
    },
    buttonApplyFlat: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'primary',
    },
    icon: {
      type: String,
    },
    message: {
      type: String,
    },
    persistent: Boolean,
    title: {
      type: String,
    },
    width: {
      type: Number,
      default: 450,
    },
  },
  data() {
    return {
      value: false,
    };
  },
  mounted() {
    document.addEventListener('keyup', this.onEnterPressed);
  },
  destroyed() {
    document.removeEventListener('keyup', this.onEnterPressed);
  },
  methods: {
    onEnterPressed(e) {
      if (e.keyCode === 13) {
        e.stopPropagation();
        this.choose(true);
      }
    },
    choose(value) {
      value = value ? this.item : {}
      this.$emit('result', value);
      this.value = value;
      this.$destroy();
    },
    change(res) {
      this.$destroy();
    },
  },
};
</script>