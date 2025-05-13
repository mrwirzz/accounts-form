import { defineStore } from "pinia";
import { Account } from "@/types/Account";

export const useAccountStore = defineStore("accounts", {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    addAccount(account: Account) {
      this.accounts.push(account);
      this.persist();
    },
    updateAccount(updated: Account) {
      const index = this.accounts.findIndex((acc) => acc.id === updated.id);
      if (index !== -1) {
        this.accounts[index] = updated;
        this.persist();
      }
    },
    removeAccount(id: string) {
      this.accounts = this.accounts.filter((acc) => acc.id !== id);
      this.persist();
    },
    load() {
      const data = localStorage.getItem("accounts");
      if (data) this.accounts = JSON.parse(data);
    },
    persist() {
      localStorage.setItem("accounts", JSON.stringify(this.accounts));
    },
  },
});
//здесь делаем всякие действия с аккаунтами и что потом вообще в UI то будет.
//Возможно имеет смысл вынести пресист и лоад куда-нибудь.
