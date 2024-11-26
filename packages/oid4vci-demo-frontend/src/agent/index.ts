import {createAgent, TAgent} from '@veramo/core'
import {AgentRestClient} from '@veramo/remote-client'
import {IQRCodeGenerator, QrCodeProvider} from '@sphereon/ssi-sdk.qr-code-generator'
import {pdManagerMethods, IPDManager} from '@sphereon/ssi-sdk.pd-manager'
import {ISIOPv2OID4VPRPRestClient, SIOPv2OID4VPRPRestClient, Siopv2RestClientAuthenticationOpts} from '@sphereon/ssi-sdk.siopv2-oid4vp-rp-rest-client'
import {IOID4VCIRestClient, OID4VCIRestClient} from '@sphereon/ssi-sdk.oid4vci-issuer-rest-client'
import {EcosystemGeneralConfig} from '../ecosystem/ecosystem-config'
import {
    DEV_OVERRIDE_OID4VCI_AGENT_BASE_URL,
    DEV_OVERRIDE_OID4VP_AGENT_BASE_URL,
    DEV_OVERRIDE_RPC_AGENT_BASE_URL
} from '../environment'

export type VCIAgentType = TAgent<IQRCodeGenerator & ISIOPv2OID4VPRPRestClient & IOID4VCIRestClient & IPDManager>
type AgentMap = { [key: string]: VCIAgentType };

const agentByEcosystemId: AgentMap = {}

const buildAuthentication = (generalConfig: EcosystemGeneralConfig): Siopv2RestClientAuthenticationOpts => ({
    enabled: !!generalConfig.authenticationEnabled || !!generalConfig.authenticationStaticToken,
    ...(generalConfig.authenticationStaticToken && {bearerToken: generalConfig.authenticationStaticToken})
})

const getOrCreateAgent = (ecoSystemId: string, generalConfig: EcosystemGeneralConfig): VCIAgentType => {
    if (ecoSystemId in agentByEcosystemId) {
        return agentByEcosystemId[ecoSystemId]
    }

    const agent = createAgent<IQRCodeGenerator & ISIOPv2OID4VPRPRestClient & IOID4VCIRestClient & IPDManager>({
        plugins: [
            new QrCodeProvider(),
            new SIOPv2OID4VPRPRestClient({
                baseUrl: DEV_OVERRIDE_OID4VP_AGENT_BASE_URL
                    ?? generalConfig.oid4vpAgentBaseUrl
                    ?? 'https://ssi.sphereon.com/agent',
                authentication: buildAuthentication(generalConfig)
            }),
            new OID4VCIRestClient({
                baseUrl: DEV_OVERRIDE_OID4VCI_AGENT_BASE_URL
                    ?? generalConfig.oid4vciAgentBaseUrl
                    ?? 'https://ssi.sphereon.com/issuer',
                authentication: buildAuthentication(generalConfig)
            }),
            new AgentRestClient({
                url: DEV_OVERRIDE_RPC_AGENT_BASE_URL
                    ?? generalConfig.rpcAgentBaseUrl 
                    ?? generalConfig.oid4vpAgentBaseUrl // For backwards compatibility
                    ?? 'https://ssi.sphereon.com/issuer',
                enabledMethods: [...pdManagerMethods],
            }),
        ]
    })
    agentByEcosystemId[ecoSystemId] = agent
    return agent
}

export default getOrCreateAgent
