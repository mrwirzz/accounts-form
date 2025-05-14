<template>
  <div class="grid grid-cols-12 gap-2 items-start mb-3">
    <!-- Метки -->
    <div class="col-span-3">
      <LabelInput
        v-model="localAccount.rawLabels"
        :status="getFieldStatus('labels')"
        @blur="handleLabelBlur"
        @update-value="handleLabelInput"
      />
    </div>

    <!-- Тип записи -->
    <div class="col-span-2">
      <n-select
        v-model:value="localAccount.type"
        :options="accountTypeOptions"
        placeholder="Тип"
        @update:value="handleTypeChange"
        :status="getFieldStatus('type')"
      />
    </div>

    <!-- Логин -->
    <div class="col-span-3">
      <n-input
        v-model:value="localAccount.login"
        placeholder="Логин"
        @blur="validate"
        :status="getFieldStatus('login')"
      />
    </div>

    <!-- Пароль -->
    <div class="col-span-3" v-if="localAccount.type === 'Локальная'">
      <n-input
        v-model:value="localAccount.password"
        :type="passwordVisible ? 'text' : 'password'"
        placeholder="Пароль"
        @blur="validate"
        :status="getFieldStatus('password')"
      >
        <template #suffix>
          <n-button
            quaternary
            size="tiny"
            @click="passwordVisible = !passwordVisible"
            style="padding: 0"
          >
            <span>{{ passwordVisible ? "N" : "Y" }}</span>
          </n-button>
        </template>
      </n-input>
    </div>

    <!-- Кнопка удаления -->
    <div class="col-span-1 flex justify-center items-center pt-1">
      <n-button text type="error" @click="onRemove"> 🗑️ </n-button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch, defineComponent } from "vue";
import LabelInput from "./LabelInput.vue";
import { NInput, NSelect, NButton } from "naive-ui";
import type { Account } from "@/types/Account";

export default defineComponent({
  name: "AccountItem",
  components: {
    LabelInput,
    NInput,
    NSelect,
    NButton,
  },
  props: {
    account: {
      type: Object as () => Account,
      required: true,
    },
    hasTriedSubmit: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["remove", "update:account"],
  setup(props, { emit }) {
    const passwordVisible = ref(false);
    const localAccount = ref<Account>(
      JSON.parse(JSON.stringify(props.account))
    );

    watch(
      () => props.account,
      (newVal) => {
        localAccount.value = JSON.parse(JSON.stringify(newVal));
      },
      { deep: true }
    );

    watch(
      localAccount,
      (val) => {
        emit("update:account", val);
      },
      { deep: true }
    );

    const accountTypeOptions = [
      { label: "LDAP", value: "LDAP" },
      { label: "Локальная", value: "Локальная" },
    ];

    function handleTypeChange() {
      if (localAccount.value.type === "LDAP") {
        localAccount.value.password = null;
      }
      validate();
    }

    function handleLabelBlur() {
      const labels = localAccount.value.rawLabels
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);
      localAccount.value.labels = labels.map((label) => ({ text: label }));
      validate();
    }

    function handleLabelInput(value: string) {
      if (value.endsWith(" ")) {
        localAccount.value.rawLabels = value.trim() + "; ";
      }
    }

    function validate() {
      let isValid = true;
      const acc = localAccount.value;

      if (!acc.login || acc.login.length < 3 || acc.login.length > 100) {
        isValid = false;
      }

      if (acc.type === "Локальная") {
        if (
          !acc.password ||
          acc.password.length < 6 ||
          acc.password.length > 100
        ) {
          isValid = false;
        }
      }

      const labels = acc.rawLabels
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);
      if (labels.some((label) => label.length > 20)) {
        isValid = false;
      }

      acc.isValid = isValid;
    }

    function getFieldStatus(field: string): "error" | undefined {
      if (!props.hasTriedSubmit) return undefined;
      return !localAccount.value.isValid ? "error" : undefined;
    }

    function onRemove() {
      emit("remove", localAccount.value.id);
    }

    return {
      passwordVisible,
      localAccount,
      accountTypeOptions,
      handleTypeChange,
      handleLabelBlur,
      handleLabelInput,
      validate,
      getFieldStatus,
      onRemove,
    };
  },
});
</script>
