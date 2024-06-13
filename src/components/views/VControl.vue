<template>
  <v-sheet class="w-100">
    <v-sheet class="text-h6 mb-4"
      >{{ label }} <span v-show="required">*</span></v-sheet
    >
    <v-combobox v-if="controlType == 'combobox'" :items="items"></v-combobox>
    <v-textarea
      v-else-if="controlType == 'textarea'"
      :label="labelIn"
    ></v-textarea>
    <v-text-field v-else :label="labelIn"></v-text-field>
  </v-sheet>
</template>

<script>
export default {
  props: {
    label: {
      Type: String,
    },
    labelIn: {
      Type: String,
      Default: "",
    },
    required: {
      Type: Boolean,
      default: false,
    },
    controlType: {
      Type: String,
      default: "text-field",
    },
    items: {
      Type: Array,
      default: () => [],
    },
  },
  setup() {},
};
</script>