import React, {useEffect, useState} from 'react'
import {useTranslation} from "react-i18next"
import '../../css/typography.css'
import {DataFormRow, SSIInformationRequestPageConfig} from "../../ecosystem/ecosystem-config"
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

function getInitialState(form: DataFormRow[] | undefined) {
    if (!form) {
        return {
            firstName: '',
            lastName: '',
            emailAddress: ''
        }
    }
    return transformFormConfigToEmptyObject(form)
}

function isFormDataValid(formData: FormOutputData, form?: DataFormRow[]) {
    let requiredFields = Object.keys(formData)
    if (form) {
        requiredFields = extractRequiredKeys(form)
    }
    for (let field of requiredFields) {
        if (!formData[field] || formData[field]!.toString().trim() === '') {
            return false
        }
    }
    return true
}

const SSIInformationRequestPage: React.FC = () => {
    const flowRouter = useFlowRouter<SSIInformationRequestPageConfig>()
    const pageConfig = flowRouter.getPageConfig()
    const location = useLocation()
    const credentialName = useEcosystem().getGeneralConfig().credentialName
    const state: State | undefined = location.state
    const credentialsReader = useCredentialsReader()
    const [credentialsData, setCredentialsData] = useState<ImmutableRecord | undefined>()
    const {t} = useTranslation()
    const [formData, setFormData] = useState<FormOutputData>(getInitialState(pageConfig.form))
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
        return isTabletOrMobile ? '50%' : '40%'
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
                    width: pageConfig.leftPaneWidth ?? '60%',
                    height: isTabletOrMobile ? '100%' : '100vh',
                    flexDirection: 'column',
                    alignItems: 'center',
                    ...((pageConfig.photo) && {background: `url(${pageConfig.photo}) 0% 0% / cover`}),
                    ...(pageConfig.backgroundColor && {backgroundColor: pageConfig.backgroundColor}),
                    ...(pageConfig.logo && {justifyContent: 'center'})
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
                         <text
                             className={"poppins-medium-36"}
                             style={{maxWidth: 735, color: '#FBFBFB', marginTop: "auto", marginBottom: 120}}
                         >
                             {t(`${pageConfig.text_top_of_image}`)}
                         </text>
                    }
                </div>
            </NonMobile>
            <div style={{
                display: 'flex',
                flexGrow: 1,
                width: determineWidth(),
                alignItems: 'center',
                flexDirection: 'column',
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
                        <text
                            className={"inter-normal-24"}
                            style={{marginBottom: 12}}
                        >
                            {t(pageConfig.sharing_data_right_pane_title)}
                        </text>
                        <text
                            className={"poppins-normal-14"}
                            style={{maxWidth: 313, textAlign: 'center'}}
                        >
                            {t(pageConfig.sharing_data_right_pane_paragraph ?? 'sharing_data_right_pane_paragraph', {credentialName})}
                        </text>
                    </div>
                    <div/>
                    {initComplete && ( // We should not render the form until handleVPToken's result came back
                        <Form
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

export default SSIInformationRequestPage
