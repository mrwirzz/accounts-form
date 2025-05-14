<template>
  <n-space vertical size="large" class="p-4">
    <n-space justify="space-between" align="center">
      <n-h2>Учетные записи</n-h2>
      <n-button type="primary" @click="addAccount" strong>
        + Добавить
      </n-button>
    </n-space>

    <n-alert v-if="accounts.length === 0" type="info" show-icon>
      Пока нет ни одной учетной записи. Нажмите «Добавить», чтобы создать.
    </n-alert>

    <n-space vertical size="large">
      <n-card
        v-for="account in accounts"
        :key="account.id"
        :bordered="true"
        size="medium"
        hoverable
      >
        <AccountCard
          :account="account"
          :has-tried-submit="hasTriedSubmit"
          :account-type-options="accountTypeOptions"
          @update="validateAccount"
          @remove="removeAccount"
        />
      </n-card>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAccountStore } from "@/stores/accountStore";
import { v4 as uuidv4 } from "uuid";
import { NButton, NH2, NSpace, NCard, NAlert } from "naive-ui";
import type { Account } from "@/types/Account";
import AccountCard from "@/components/AccountCard.vue";

const store = useAccountStore();

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

function validateAccount(account: Account) {
  let isValid = true;
  if (
    !account.login ||
    account.login.length < 3 ||
    account.login.length > 100
  ) {
    isValid = false;
  }
  if (account.type === "Локальная") {
    if (
      !account.password ||
      account.password.length < 6 ||
      account.password.length > 100
    ) {
      isValid = false;
    }
  }
  const labels = account.rawLabels
    .split(";")
    .map((s: string) => s.trim())
    .filter(Boolean);
  if (labels.some((label: string) => label.length > 20)) {
    isValid = false;
  }
  account.isValid = isValid;
  store.updateAccount(account);
  return isValid;
}
</script>
