/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IDENTITY_CONTRACT_ADDRESS: string
  readonly VITE_CREDENTIAL_CONTRACT_ADDRESS: string
  readonly VITE_ACCESS_CONTROL_CONTRACT_ADDRESS: string
  readonly VITE_AUDIT_CONTRACT_ADDRESS: string
  readonly VITE_MOCK_VERIFIER_ADDRESS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// JSON module declarations
declare module "*.json" {
  const value: any;
  export default value;
}
