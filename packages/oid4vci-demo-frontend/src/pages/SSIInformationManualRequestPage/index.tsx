import React, {useEffect, useState} from 'react'
import {useTranslation} from "react-i18next"
import '../../css/typography.css'
import {DataFormRow, SSIInformationManualRequestPageConfig} from "../../ecosystem/ecosystem-config"
import SSIPrimaryButton from "../../components/SSIPrimaryButton"
import {useLocation} from "react-router-dom"
import {useMediaQuery} from "react-responsive"
import {NonMobile} from "../../index"
import {extractRequiredKeys, transformFormConfigToEmptyObject} from "../../utils/ObjectUtils"
import Form from "../../components/Form"
import {FormOutputData, ImmutableRecord} from "../../types"
import {useFlowRouter} from "../../router/flow-router"
import {useEcosystem} from "../../ecosystem/ecosystem"
import {useCredentialsReader} from "../../utils/credentials-helper"


type State = {
    data?: any
}

function getInitialState(formConfig: SSIInformationManualRequestPageConfig) {
  if (!formConfig.form) {
      return {}
  }
  return transformFormConfigToEmptyObject(formConfig.form)
}

function isFormDataValid(formData: FormOutputData, form: DataFormRow[]) {
    const requiredFields = extractRequiredKeys(form)
    for (let field of requiredFields) {
        if (!formData[field] || formData[field]!.toString().trim() === '') {
            return false
        }
    }
    return true
}

const SSIInformationManualRequestPage: React.FC = () => {
    const flowRouter = useFlowRouter<SSIInformationManualRequestPageConfig>()
    const pageConfig = flowRouter.getPageConfig()
    const location = useLocation()
    const credentialName = useEcosystem().getGeneralConfig().credentialName
    const state: State | undefined = location.state
    const credentialsReader = useCredentialsReader()
    const [credentialsData, setCredentialsData] = useState<ImmutableRecord | undefined>()
    const {t} = useTranslation()
    const [formData, setFormData] = useState<FormOutputData>(getInitialState(pageConfig))
    const [initComplete, setInitComplete] = useState<boolean>(false)
    const isTabletOrMobile = useMediaQuery({query: '(max-width: 767px)'})


    useEffect(() => {
        credentialsReader.credentialDataFromVpToken(state?.data?.vp_token).then((credentialData?: ImmutableRecord) => {
            setCredentialsData(credentialData)
            setInitComplete(true)
        })
    }, [])

    const onFormValueChange = async (formData: FormOutputData): Promise<void> => {
        setFormData(formData)
    }

	function determineWidth() {
        if(pageConfig.leftPaneWidth && pageConfig.leftPaneWidth.includes('%')) {
            return '100%'
        }
        return isTabletOrMobile ? pageConfig.mobile?.width ?? '50%' : '40%'
    }

    return (
        <div style={{
            display: 'flex',
            height: "100vh",
            width: '100vw',
            ...(isTabletOrMobile && {
                overflowX: "hidden",
                ...(pageConfig.mobile?.backgroundColor && {
                    backgroundColor: pageConfig.mobile.backgroundColor
                })
            })
        }}>
            <NonMobile>
                <div id={"photo"} style={{
                    display: 'flex',
                    width: pageConfig.leftPaneWidth ?? 'auto',
                    height: pageConfig.leftPaneWidth ? '100%' : 'auto',
                    flexDirection: 'column',
                    alignItems: 'center',
                    ...((pageConfig.photo) && {background: `url(${pageConfig.photo}) 0% 0% / cover`}),
                    ...(pageConfig.backgroundColor && {backgroundColor: pageConfig.backgroundColor}),
                    ...(pageConfig.logo && {justifyContent: pageConfig.logo.justifyContent ?? 'center'})
                }}>
                    {pageConfig.logo &&
                        <img
                            src={pageConfig.logo.src}
                            alt={pageConfig.logo.alt}
                            width={pageConfig.logo.width}
                            height={pageConfig.logo.height}
                        />
                    }
                    { pageConfig.text_top_of_image &&
                         <p
                             className={"poppins-medium-36"}
                             style={{maxWidth: 735, color: pageConfig.textTopOfImageColor ?? '#FBFBFB', marginTop: "auto", marginBottom: 120, marginLeft: 20}}
                         >
                             {t(`${pageConfig.text_top_of_image}`)}
                         </p>
                    }
                </div>
            </NonMobile>
            <div style={{
                display: 'flex',
                flexGrow: 1,
                width: determineWidth(),
                alignItems: 'center',
                flexDirection: 'column',
                ...(isTabletOrMobile && { height: '100vh' }),
                ...(isTabletOrMobile && { gap: 24, ...(pageConfig.mobile?.backgroundColor && { backgroundColor: pageConfig.mobile.backgroundColor }) }),
                ...(!isTabletOrMobile && { justifyContent: 'center', backgroundColor: '#FFFFFF' }),
            }}>
                {(isTabletOrMobile && pageConfig.mobile?.logo) &&
                    <img
                        src={pageConfig.mobile.logo.src}
                        alt={pageConfig.mobile.logo.alt}
                        width={pageConfig.mobile.logo?.width ?? 150}
                        height={pageConfig.mobile.logo?.height ?? 150}
                    />
                }
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '63%',
                }}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <p
                            className={"inter-normal-24"}
                            style={{marginBottom: 12, ...(pageConfig?.sharing_data_right_pane_title_style)}}
                        >
                            {t(pageConfig.sharing_data_right_pane_title)}
                        </p>
                        <p
                            className={"poppins-normal-14"}
                            style={{textAlign: 'center', ...(pageConfig?.sharing_data_right_pane_paragraph_style)}}
                        >
                            {t(pageConfig.sharing_data_right_pane_paragraph ?? 'sharing_data_right_pane_paragraph', {credentialName})}
                        </p>
                    </div>
                    <div/>
                    {initComplete && ( // We should not render the form until handleVPToken's result came back
                        <Form
                            inputBackgroundColor={(isTabletOrMobile ? pageConfig.mobile?.backgroundColor : undefined) }
                            formConfig={pageConfig.form}
                            formInitData={credentialsData}
                            onChange={onFormValueChange}
                        />
                    )}
                    <div>
                        <SSIPrimaryButton
                            caption={t(pageConfig.primaryButtonResourceId ?? 'label_continue')}
                            disabled={!isFormDataValid(formData, pageConfig.form)}
                            onClick={async () => await flowRouter.nextStep({payload: formData})}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SSIInformationManualRequestPage
