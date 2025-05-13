<template>
  <div class="p-4">
    <n-h2>Учетные записи</n-h2>
    <n-button type="primary" @click="addAccount" class="mb-4">+</n-button>

    <div
      v-for="account in accounts"
      :key="account.id"
      class="mb-4 border p-4 rounded-lg shadow-sm"
    >
      <!-- Метка -->
      <n-input
        v-model:value="account.rawLabels"
        placeholder="Введите метки через ; (макс. 50 символов)"
        @blur="handleLabelBlur(account)"
        @update:value="(value) => handleLabelInput(value, account)"
        :status="getFieldStatus(account, 'labels')"
        maxlength="50"
        show-count
      >
        <template #prefix>Метка</template>
        <template #suffix>макс. 50 симв.</template>
      </n-input>
      <!-- handleLabelInput - добавляет ; перед пробелом -  -->
      <!-- Тип записи -->
      <n-select
        v-model:value="account.type"
        :options="accountTypeOptions"
        placeholder="Тип записи"
        @update:value="handleTypeChange(account)"
        class="mt-2"
        :status="getFieldStatus(account, 'type')"
      />

      <!-- Логин -->
      <n-input
        v-model:value="account.login"
        placeholder="Введите логин"
        @blur="validateAccount(account)"
        class="mt-2"
        :status="getFieldStatus(account, 'login')"
      >
        <template #prefix>Логин</template>
      </n-input>

      <!-- Пароль -->
      <n-input
        v-if="account.type === 'Локальная'"
        v-model:value="account.password"
        placeholder="Введите пароль"
        type="password"
        @blur="validateAccount(account)"
        class="mt-2"
        :status="getFieldStatus(account, 'password')"
      >
        <template #prefix>Пароль</template>
      </n-input>

      <!-- Удалить -->
      <div class="flex justify-end mt-2">
        <n-button type="error" ghost @click="removeAccount(account.id)"
          >Удалить</n-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAccountStore } from "@/stores/accountStore";
import { v4 as uuidv4 } from "uuid";
import { NButton, NInput, NSelect, NH2, useMessage } from "naive-ui";
import type { Account } from "@/types/Account";

const store = useAccountStore();
const message = useMessage();

const accountTypeOptions = [
  { label: "LDAP", value: "LDAP" },
  { label: "Локальная", value: "Локальная" },
];

const accounts = ref<Account[]>(store.accounts);
const hasTriedSubmit = ref(false);

function addAccount() {
  const newAccount: Account = {
    id: uuidv4(),
    rawLabels: "",
    labels: [],
    type: "LDAP",
    login: "",
    password: null,
    isValid: false,
  };
  accounts.value.push(newAccount);
  store.addAccount(newAccount);
}

function removeAccount(id: string) {
  if (confirm("Вы уверены, что хотите удалить эту учетную запись?")) {
    accounts.value = accounts.value.filter((acc: Account) => acc.id !== id);
    store.removeAccount(id);
  }
}

function handleLabelBlur(account: Account) {
  const labels = account.rawLabels
    .split(";")
    .map((s: string) => s.trim())
    .filter(Boolean);
  account.labels = labels.map((label: any) => ({ text: label }));
  validateAccount(account);
  store.updateAccount(account);
}

function handleTypeChange(account: Account) {
  if (account.type === "LDAP") {
    account.password = null;
  }
  validateAccount(account);
  store.updateAccount(account);
}

function validateAccount(account: Account) {
  let isValid = true;
  // Валидация логина
  if (
    !account.login ||
    account.login.length < 3 ||
    account.login.length > 100
  ) {
    isValid = false;
  }
  // Валидация пароля для локальных учетных записей
  if (account.type === "Локальная") {
    if (
      !account.password ||
      account.password.length < 6 ||
      account.password.length > 100
    ) {
      isValid = false;
    }
  }
  // Валидация меток
  const labels = account.rawLabels
    .split(";")
    .map((s: string) => s.trim())
    .filter(Boolean);
  if (labels.some((label: string | any[]) => label.length > 20)) {
    isValid = false;
  }
  account.isValid = isValid;
  store.updateAccount(account);
  return isValid;
}

function getFieldStatus(account: Account, field: string): "error" | undefined {
  if (!hasTriedSubmit.value) return undefined;
  if (!account.isValid) return "error";
  return undefined;
}

function handleLabelInput(value: string, account: Account) {
  if (value.endsWith(" ")) {
    account.rawLabels = value.trim() + "; ";
  }
}
</script>

<style scoped>
.invalid {
  border-color: red !important;
}
</style>
