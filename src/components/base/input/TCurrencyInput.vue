<template>
  <div class="el-input" :class="[{ 'is-disabled': disabled }]">
    <div
      :class="[
        'el-input__wrapper',
        { 'is-focus': isFocus },
        { 'is-disabled': disabled },
      ]"
    >
      <input
        ref="inputRef"
        type="text"
        class="el-input__inner"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="onHandleInput"
        @focus="focus"
        @blur="blur"
      />
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useCurrencyInput } from "vue-currency-input";

export default {
  name: "TCurrencyInput",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    /**
     * currency: "VND",
     * locale: "de-DE",
     * currencyDisplay: "symbol", // narrowSymbol, code, name, hidden
     * precision: 0, // No of Decimal places
     * hideCurrencySymbolOnFocus: true,
     * hideGroupingSeparatorOnFocus: false, // Ex: hide . in 1.000 when focus input
     * hideNegligibleDecimalDigitsOnFocus: true,
     * useGrouping: true, // Ex: use 1.000 (not 1000)
     * valueRange: {
          min: 0,
        },
     */
    options: Object,
    placeholder: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { inputRef, setValue  } = useCurrencyInput(props.options);

    const isFocus = ref(false);
    const focus = () => {
      isFocus.value = true;
    };

    const blur = () => {
      isFocus.value = false;
    };

    const onHandleInput = (e) => {};

    watch(
      () => props.modelValue,
      (value) => {
        setValue(value);
      }
    );

    return { inputRef, focus, isFocus, blur, onHandleInput };
  },
};
</script>

<style>
@import "@/styles/element-plus.css";

.el-input {
  height: 56px;
}

.el-input__wrapper {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.38) inset;
  padding: 16px;
}

.el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #000 inset;
}

.el-input__inner {
  color: #000;
}
</style>