import {FormFieldValue, ImageProperties, LogoProperties} from "../types"
import {CSSProperties, HTMLAttributeAnchorTarget, HTMLInputTypeAttribute} from "react"
import {IProps} from "../components/SSISecondaryButton"

export interface VCIConfig {
    general: EcosystemGeneralConfig
    pages: VCIConfigPages
    routes: VCIConfigRoute[]
    components: VCIConfigComponents
}

export interface ComponentConfig {
}

export interface PageConfig {
    vpDefinitionId?: string
}
export interface SSICredentialVerifyFromVPRequestPageConfig extends PageConfig {
  photoRight: string
  photoLeft?: string
  backgroundColor?: string
  logo?: LogoProperties
  textColor?: string
  rightPaneLeftPane?: {
    grid?: {
      gridColumn?: string
      gridRow?: string
      height?: string
    }
    welcomeLabel?: {
      style?: CSSProperties
      className?: string
      headerResourceId: string
      descriptionResourceId: string
    }
    qrCode?: {
      topTitle?: {
        style?: CSSProperties
      },
      bottomText?: {
        fontColor?: string
        className?: string
        credential_verify_request_right_pane_bottom_title?: string
        credential_verify_request_right_pane_bottom_paragraph?: string
      }
      pane?: {
        height?: string
      }
      width?: number
      marginTop?: string,
      marginBottom?: string
    },
    width?: string
  }
}

export interface SSICredentialVerifyRequestPageConfig extends PageConfig {
    leftPaneWidth?: string
    photoLeft?: string
    photoRight: string
    backgroundColor?: string
    logo?: LogoProperties
    enableRightPaneButton?: boolean
    rightPaneButtonStepId?: string
    downloadAppStepId?: string
    responseRedirectURI?: string
    bottomParagraph?: string
    mobile?: {
        height?: string | number
        qrCode?: {
          rootContainer?: {
            style?: CSSProperties
          },
          container?: {
            style?: CSSProperties
          }
          bottomText?: {
            paragraph?: string
            style?: CSSProperties
            className?: string
            pStyle?: CSSProperties
          }
        }
        logo?: ImageProperties
        backgroundColor?: string
        image?: string
    },
    rightPaneGrid?: {
      style?: CSSProperties,
    },
    rightPaneLeftPane?: {
      welcomeLabel?: {
        style?: CSSProperties
        className?: string
      }
      qrCode?: {
        fgColor?: string
        topTitle?: {
          value?: string
          style?: CSSProperties
          h2Style?: CSSProperties
          pStyle?: CSSProperties
        },
        topDescription?: string
        bottomText?: {
          fontColor?: string
          pStyle?: CSSProperties
          h2Style?: CSSProperties
          className?: string
          credential_verify_request_right_pane_bottom_title?: string
          credential_verify_request_right_pane_bottom_paragraph?: string
        }
        pane?: {
          height?: string
        }
        width?: number
        marginTop?: string,
        marginBottom?: string
      },
      width?: string
    }
    mostRightPanel?: {
      separator?: {
        logo?: LogoProperties
      },
      width?: string
      height?: string
      logo?: LogoProperties
    }
}

export interface SSILoadingPageConfig extends PageConfig {
    leftPaneWidth?: string
    backgroundColor?: string
    logo?: LogoProperties
    sharing_data_right_pane_title: string
    sharing_data_right_pane_paragraph: string
    spinnerColor?: string
    mobile?: {
        logo?: LogoProperties
        backgroundColor?: string
        image?: string
    },
}

export interface SSIIdentityVerificationPageConfig extends PageConfig {
    leftPaneWidth?: string
    backgroundColor?: string
    logo?: LogoProperties
    sharing_data_right_pane_title: string
    mobile?: {
        logo?: LogoProperties
        backgroundColor?: string
        image?: string
    },
}

export interface SSIWelcomePageConfig extends PageConfig {
    leftPaneWidth?: string
    backgroundColor?: string
    logo?: LogoProperties
    right_pane_title?: string
    right_pane_subtitle?: string
    right_pane_paragraph?: string
    right_pane_paragraph_text_align?: string
    rightPaneButtonStepId?: string
    mobile?: {
        logo?: LogoProperties
        backgroundColor?: string
        image?: string
    },
}
export interface SSIVerifyEmailPageConfig extends PageConfig {
    leftPaneWidth?: string
    backgroundColor?: string
    logo?: LogoProperties
    rightPaneTitle: string
    rightPaneParagraph: string
    verifyDigitsTitle: string
    numberOfDigits? : number
    primaryButtonResourceId?: string
    primaryButtonStepId?: string
    mobile?: {
        logo?: LogoProperties
        backgroundColor?: string
        image?: string
    },
}

export interface SSICredentialIssuedSuccessPageConfig extends PageConfig {
    leftPaneWidth?: string
    backgroundColor?: string
    logo?: LogoProperties
    photoLeft?: string
    photoRight: string
    rightPaneButtonStepId?: string
    rightPaneTitle?: string
    rightPaneParagraph?: string
    rightPaneButtonCaption?: string
    rightPaneTextHeight?: string
    rightPaneTextMarginTop?: string
    rightPaneTextMarginBottom?: string
    rightPaneButtonWidth?: string
    rightPaneButtonHeight?: string
}

export interface SSICredentialsLandingPageConfig extends PageConfig { // TODO
    leftPaneWidth?: string
    logo?: LogoProperties
    mobile?: {
        logo?: LogoProperties
    }
    backgroundColor?: string
    pageTitle: string
    text: string
    credentials: SSICredentialCardConfig[]
    presentationDefinitions: SSIPresentationDefinitionCardConfig[]
}

export interface SSIInformationSharedSuccessPageConfig extends PageConfig {
    topTitle?: string
    topDescription?: string
    buttonCaption?: string
    leftPaneWidth?: string
    photoLeft?: string
    photoLeftManual?: string
    leftTextHideManual?: boolean
    textLeft?: string
    photoRight: string
    textRight?: string
    mobile?: {
        logo: ImageProperties
    },
    backgroundColor?: string
    logo?: LogoProperties
    sideImage?: LogoProperties
}

export interface SSIInformationVerifyPageConfig extends PageConfig {
    topTitle?: string
    topDescription?: string
    photoLeft?: string
    leftPaneWidth?: string
    backgroundColor?: string
    logo?: LogoProperties
    numberOfColumns?: number
}

export interface SSICredentialIssueRequestPageConfig extends PageConfig {
    leftPaneWidth?: string
    photoWallet?: string
    textLeft?: string
    backgroundColor?: string
    logo?: LogoProperties
    title?: string
    topParagraph?: string
    bottomParagraph?: string
    rightPaneHeight?: string | number
    enableWebWalletAddress?: boolean
    mobile?: {
        width?: string | number
        logo?: LogoProperties
        backgroundColor?: string
        image?: ImageProperties
        bottomParagraph?: string
        rightPaneWidth?: string | number
        bottomText?: {
          paragraph?: string
          pStyle?: CSSProperties
          className?: string
        }
    },
  qrCodeContainer?: {
      height: string
  }
  qrCode?: {
      topTitle?: {
        h2Style?: CSSProperties
        pStyle?: CSSProperties
      },
    bottomText?: {
        pStyle?: CSSProperties
        className?: string
    }
  }
}

export interface SSIInformationManualRequestPageConfig extends PageConfig {
    leftPaneWidth?: string
    photo?: string
    text_top_of_image?: string
    textTopOfImageColor?: string
    sharing_data_right_pane_title_style?: CSSProperties
    sharing_data_right_pane_paragraph_style?: CSSProperties
    sharing_data_right_pane_title: string
    sharing_data_right_pane_paragraph?: string
    primaryButtonResourceId?: string
    form: DataFormRow[]
    mobile?: {
        width?: string | number
        logo?: LogoProperties
        backgroundColor?: string
    },
    backgroundColor?: string
    logo?: LogoProperties
    title?: string
    topParagraph?: string
}

export type DataFormRow = DataFormElement[];

export interface DataFormElement {
    id: string
    key: string
    type: HTMLInputTypeAttribute
    required?: boolean
    readonlyWhenAbsentInPayload?: boolean
    defaultValue?: FormFieldValue
    options?: Array<string>
    label?: string
    labelUrl?: string
    labelStyle?: CSSProperties
    inputStyle?: CSSProperties
    readonly?: boolean
    customValidation?: string
    display?: {
        checkboxBorderColor?: string
        checkboxLabelColor?: string
        checkboxSelectedColor?: string
    }
}

export interface SSIDownloadPageConfig extends PageConfig {
    rightPane: {
        paradymWalletQRCode: {
            style: CSSProperties,
            image: ImageProperties & { style: CSSProperties }
            button: IProps & { style: CSSProperties }
            downloadUrl: string
        },
        sphereonWalletQRCode: {
            style: CSSProperties,
            image: ImageProperties & { style: CSSProperties }
            button: IProps & { style: CSSProperties }
            downloadUrl: string
        }
    }
    leftPane: {
        width?: string
        leftPhone: {
            logo: ImageProperties
            image: ImageProperties
        }
        rightPhone: {
            logo: ImageProperties
            image: ImageProperties
        }
    }
}

export interface SphereonWalletQRCode {
    buttonCaptionResourceId: string
    style: CSSProperties
    image: ImageProperties & { style: CSSProperties }
    button: IProps & { style: CSSProperties }
    downloadUrl: string
    target?: HTMLAttributeAnchorTarget
    qrTextResourceId?: string
}

export interface SphereonWalletPageConfig extends PageConfig {
    leftPane: {
        image?: string
        backgroundColor?: string
        width?: string
        logo?: LogoProperties,
        mobile?: {
            logo?: LogoProperties
            backgroundColor?: string
            image?: string
        },
    }
    rightPane: {
        image: string
        width?: string
        backgroundColor?: string
        sphereonWalletQRCodes: SphereonWalletQRCode[]
        enablePrimaryButton?: boolean
        primaryButtonResourceId?: string
        primaryButtonStepId?: string
        paragraphResourceId?: string
    }
}

export interface SSILandingPageConfig extends PageConfig {
    photoRight: string
    photoLeft: string
    logo: ImageProperties,
    styles: {
        mainContainer: {
            backgroundColor: string
        },
        leftCardView: {
            textColor?: string
            backgroundColor: string
        },
        rightCardView: {
            textColor?: string
            buttonType: string
        }
    }
}

export interface SSISelectCredentialPageConfig extends PageConfig {
    logo: ImageProperties,
    styles: {
        mainContainer: {
            backgroundColor: string
            textGradient: string
        },
    }
}

export interface SSICardConfig extends ComponentConfig {
}

export interface SSICredentialCardConfig extends ComponentConfig {
    name: string
    route: string
    description?: string
    backgroundColor?: string
    backgroundImage?: string
    logo?: ImageProperties
}

export interface SSIPresentationDefinitionCardConfig extends ComponentConfig {
    id: string
    name: string
    route: string
    description?: string
    backgroundColor?: string
    backgroundImage?: string
    logo?: ImageProperties
}


export interface SSIDeepLinkConfig extends ComponentConfig {
}

export interface SSICardViewConfig extends ComponentConfig {
    styles: {
        mainContainer: {
            backgroundColor: string,
            textColor: string
        },
        secondaryButton: {
            backgroundColor: string
        }
    }
}

export interface SSIPrimaryButtonConfig extends ComponentConfig {
    styles: {
        mainContainer: {
            backgroundColor: string
        }
        button: {
            width?: string | number
            height?: string | number
        }
    }
}

export interface SSISecondaryButtonConfig extends ComponentConfig {
    styles: {
        mainContainer: {
            backgroundColor?: string
            color: string
        }
        button: {
            width?: string | number
            height?: string | number
        }
    }
}

export interface EcosystemGeneralConfig {
    oid4vpAgentBaseUrl?: string
    oid4vciAgentBaseUrl?: string
    rpcAgentBaseUrl?: string
    authenticationEnabled?: boolean
    authenticationStaticToken?: string
    verifierUrl?: string
    backCaption?: string
    verifierUrlCaption?: string
    downloadUrl?: string
    credentialName: string
    issueCredentialType: string
}

export interface SSITextConfig extends ComponentConfig {
}

export interface VCIConfigPages {
    SSICredentialIssuedSuccessPage: SSICredentialIssuedSuccessPageConfig
    SSICredentialVerifyFromVPRequestPage?: SSICredentialVerifyFromVPRequestPageConfig
    SSICredentialVerifyRequestPage?: SSICredentialVerifyRequestPageConfig
    SSIInformationVerifyPage?: SSIInformationVerifyPageConfig
    SSIInformationSharedSuccessPage: SSIInformationSharedSuccessPageConfig
    SSILandingPage: SSILandingPageConfig
    SSICredentialIssueRequestPage: SSICredentialIssueRequestPageConfig
    SSIInformationManualRequestPage: SSIInformationManualRequestPageConfig
    SSIDownloadPage: SSIDownloadPageConfig
    SSISelectCredentialPage: SSISelectCredentialPageConfig
    SSICredentialsLandingPage: SSICredentialsLandingPageConfig
    SSILoadingPage: SSILoadingPageConfig
    SSIWelcomePage: SSIWelcomePageConfig
    SSIIdentityVerificationPage: SSIIdentityVerificationPageConfig
}

export interface VCIConfigRoute {
    id?: string
    vpDefinitionId?: string
    steps: VCIConfigRouteStep[]
}

export enum VCIOperation {
    NAVIGATE = 'navigate',
    EXECUTE = 'execute'
}

export enum VCIAction {
    CREATE_CREDENTIAL_OFFER = 'create-credential-offer'
}

export interface VCIConfigRouteStep {
    id: string
    operation: VCIOperation
    nextId?: string
    isDefaultRoute?: boolean
}

export interface VCINavigationStep extends VCIConfigRouteStep {
    path: string
}

export interface VCIExecuteStep extends VCIConfigRouteStep {
    action: VCIAction
    actionParams: Record<string, any>
}

export interface VCIConfigComponents {
    DeepLink: SSIDeepLinkConfig
    SSICardView: SSICardViewConfig
    SSIPrimaryButton: SSIPrimaryButtonConfig
    SSISecondaryButton: SSISecondaryButtonConfig
    Text: SSITextConfig
}

export function getEcosystemRootConfig(ecosystemId: string): VCIConfig {
    return require(`../configs/${ecosystemId}.json`)
}

export function assertRoutes(routes: VCIConfigRoute[]) : VCIConfigRoute[] {
    if (!routes) {
        throw new Error('The routes element is missing in the ecosystem json')
    }
    if (routes.length === 0) {
        throw new Error('The routes element in the ecosystem json is missing "route" child-elements')
    }
    return routes
}

export function getEcosystemRoutes(ecosystemId: string): VCIConfigRoute[] {
    const config = getEcosystemRootConfig(ecosystemId)
    assertRoutes(config.routes)
    return config.routes
}
