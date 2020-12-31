<template>
  <v-snackbar :timeout="timeout" :color="color" v-model="value">
    <v-icon left v-if="Boolean(icon)">
      {{ icon }}
    </v-icon>
    {{ message }}

    <template v-slot:action="{ attrs }">
      <v-btn v-if="dismissible" icon v-bind="attrs" @click="dismiss">
        <v-icon>{{ closeIcon }}</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { VSnackbar, VIcon, VBtn } from "vuetify/lib";

export default {
  components: {
    VSnackbar,
    VIcon,
    VBtn,
  },
  props: {
    color: {
      type: String,
      default: "warning",
    },
    icon: {
      type: String,
      default() {
        return this.$vuetify.icons.values.info;
      },
    },
    closeIcon: {
      type: String,
      default() {
        return this.$vuetify.icons.values.close;
      },
    },
    message: {
      type: String,
      required: true,
    },
    timeout: {
      type: Number,
      default: 3000,
    },
    dismissible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      value: true,
    };
  },
  mounted() {
    document.addEventListener("keyup", this.onEnterPressed);
  },
  destroyed() {
    document.removeEventListener("keyup", this.onEnterPressed);
  },
  methods: {
    onEnterPressed(e) {
      if (e.keyCode === 13) {
        e.stopPropagation();
        this.choose(true);
      }
    },
    dismiss() {
      if (this.dismissible) {
        this.value = false;
        this.$destroy();
      }
    },
    change(res) {
      this.$destroy();
    },
  },
};
</script>