<template>
  <n-input
    v-model:value="internalValue"
    placeholder="Введите метки через ; (макс. 50 символов)"
    :status="status"
    maxlength="50"
    show-count
    @blur="onBlur"
    @update:value="handleUpdate"
  >
    <template #prefix>Метка</template>
    <template #suffix>макс. 50 симв.</template>
  </n-input>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from "vue";
import { NInput } from "naive-ui";
import type { FormValidationStatus } from "naive-ui";

export default defineComponent({
  name: "LabelInput",
  components: { NInput },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    status: {
      type: String as PropType<FormValidationStatus | undefined>,
      default: undefined,
    },
  },
  emits: ["update:modelValue", "blur", "update-value"],
  setup(props, { emit }) {
    const internalValue = ref(props.modelValue);

    watch(
      () => props.modelValue,
      (val) => {
        internalValue.value = val;
      }
    );

    function handleUpdate(value: string) {
      emit("update:modelValue", value);
      emit("update-value", value);
    }

    function onBlur() {
      emit("blur");
    }

    return {
      internalValue,
      handleUpdate,
      onBlur,
    };
  },
});
</script>
