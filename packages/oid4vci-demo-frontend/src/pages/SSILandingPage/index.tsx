import React, {useEffect, useState} from 'react'
import {NavigateOptions, useLocation, useNavigate} from 'react-router-dom'
import SSICardView from '../../components/SSICardView';
import {ButtonType} from '../../types';
import {useTranslation} from 'react-i18next';
import {
    getCurrentEcosystemGeneralConfig,
    getCurrentEcosystemPageOrComponentConfig,
    SSILandingPageConfig
} from "../../ecosystem-config";
import {useMediaQuery} from "react-responsive";
import {Sequencer} from "../../router/sequencer"

const SSILandingPage: React.FC = () => {
    const {t} = useTranslation()
    const [sequencer] = useState<Sequencer>(new Sequencer())
    const location = useLocation()
    const navigate = useNavigate()
    const isTabletOrMobile = useMediaQuery({query: '(max-width: 767px)'})

    const onManualIdentificationClick = async (): Promise<void> => {
        const params = {isManualIdentification: true}
        await sequencer.goToStep('infoRequest', params as NavigateOptions)
    }

    const onWalletIdentificationClick = async (): Promise<void> => {
        await sequencer.goToStep('verifyRequest')
    }

    const config = getCurrentEcosystemPageOrComponentConfig('SSILandingPage') as SSILandingPageConfig
    const generalConfig = getCurrentEcosystemGeneralConfig()
    const mainContainerStyle = config.styles!.mainContainer
    const leftCardViewConfig = config.styles!.leftCardView
    const rightCardViewConfig = config.styles!.rightCardView
    const optionalLeftCardViewProps = {
        ...(leftCardViewConfig.textColor && {textColor: leftCardViewConfig.textColor}),
        ...(leftCardViewConfig.backgroundColor && {backgroundColor: leftCardViewConfig.backgroundColor})
    }
    const optionalRightCardViewProps = {
        ...(rightCardViewConfig.textColor && {textColor: rightCardViewConfig.textColor}),
    }

    useEffect(() => {
        sequencer.setCurrentRoute(location.pathname, navigate)
    }, [])

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            height: '100vh',
            backgroundColor: mainContainerStyle.backgroundColor,
            flexDirection: 'column'
        }}>
            <div style={{
                maxWidth: isTabletOrMobile ? 405 : 810,
                justifyContent: 'space-between',
                alignContent: 'center',
                flexDirection: `${isTabletOrMobile ? 'column' : 'row'}`,
                display: 'flex',
                width: '100%'
            }}>
                <SSICardView
                    title={t('onboarding_left_card_title')}
                    message={t('onboarding_left_card_paragraph', {credentialName: generalConfig.credentialName})}
                    image={{
                        src: `${config.photoLeft}`,
                        alt: 'manually'
                    }}
                    button={{
                        caption: t('onboarding_left_card_button_caption'),
                        onClick: onManualIdentificationClick,
                        type: ButtonType.SECONDARY,
                    }}
                    {...optionalLeftCardViewProps}
                />

                <SSICardView
                    title={t('onboarding_right_card_title')}
                    message={t('onboarding_right_card_paragraph', {credentialName: generalConfig.credentialName})}
                    image={{
                        src: `${config.photoRight}`,
                        alt: 'wallet'
                    }}
                    button={{
                        caption: t('onboarding_right_card_button_caption'),
                        onClick: onWalletIdentificationClick,
                        type: `${rightCardViewConfig.buttonType}` as ButtonType,
                    }}
                    {...optionalRightCardViewProps}
                />

            </div>
            <img
                style={{marginTop: isTabletOrMobile ? 10 : 116}}
                src={config.logo.src}
                alt={config.logo.alt}
                width={config.logo.width}
                height={config.logo.height}
            />
        </div>
    );
};

export default SSILandingPage;
