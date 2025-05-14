declare module "naive-ui" {
  import { DefineComponent } from "vue";

  export type FormValidationStatus = "error" | "warning" | "success";
  
  export const NInput: DefineComponent<any, any, any>;
  export const NSelect: DefineComponent<any, any, any>;
  export const NButton: DefineComponent<any, any, any>;
  export const NMessageProvider: DefineComponent<any, any, any>;
  export const NSpace: DefineComponent<any, any, any>;
  export const NH2: DefineComponent<any, any, any>;
  export const NCard: DefineComponent<any, any, any>;
  export const NAlert: DefineComponent<any, any, any>;
  
  export function create(): any;
} 