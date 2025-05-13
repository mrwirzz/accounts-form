export type AccountType = "LDAP" | "Local";

export interface Account {
  id: string;
  labels: { text: string }[];
  rawLabels: string;
  type: AccountType;
  login: string;
  password: string | null;
  isValid: boolean;
}
//Сначала определяем данные для работы с учетками.
