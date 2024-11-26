export {}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            REACT_APP_DEFAULT_ECOSYSTEM?: string
            REACT_APP_DEFAULT_ECOSYSTEM_FROM_SUBDOMAIN?: string
            REACT_APP_DEFAULT_ECOSYSTEM_FROM_SUBDOMAIN_PARTS?: string
            REACT_APP_DEV_OVERRIDE_OID4VP_AGENT_BASE_URL?: string
            REACT_APP_DEV_OVERRIDE_OID4VCI_AGENT_BASE_URL?: string
        }
    }
}


export const DEFAULT_ECOSYSTEM: string | undefined = process.env.REACT_APP_DEFAULT_ECOSYSTEM
export const DEFAULT_ECOSYSTEM_FROM_SUBDOMAIN: boolean | undefined = process.env.REACT_APP_DEFAULT_ECOSYSTEM_FROM_SUBDOMAIN === 'true'
export const DEFAULT_ECOSYSTEM_FROM_SUBDOMAIN_BEFORE: string | undefined = process.env.REACT_APP_DEFAULT_ECOSYSTEM_FROM_SUBDOMAIN_SUFFIX
export const DEV_OVERRIDE_OID4VP_AGENT_BASE_URL: string | undefined = process.env.REACT_APP_DEV_OVERRIDE_OID4VP_AGENT_BASE_URL
export const DEV_OVERRIDE_OID4VCI_AGENT_BASE_URL: string | undefined = process.env.REACT_APP_DEV_OVERRIDE_OID4VCI_AGENT_BASE_URL
export const DEV_OVERRIDE_RPC_AGENT_BASE_URL: string | undefined = process.env.REACT_APP_DEV_OVERRIDE_RPC_AGENT_BASE_URL ?? DEV_OVERRIDE_OID4VP_AGENT_BASE_URL
export const APP_SSI_QR_CODE_EXPIRES_AFTER_SEC: number = process.env.APP_SSI_QR_CODE_EXPIRES_AFTER_SEC ? parseInt(process.env.APP_SSI_QR_CODE_EXPIRES_AFTER_SEC) : 300
