import {UniformCredential} from "../../types";
import {CredentialDetailsRow, toNonPersistedCredentialSummary} from "@sphereon/ui-components.credential-branding";
import {CredentialMapper, SdJwtDecodedVerifiableCredentialPayload, W3CVerifiableCredential} from "@sphereon/ssi-types";
// @ts-ignore
import crypto from 'crypto-browserify'
import {VerifiableCredential} from "@veramo/core";
import {CredentialRole} from "@sphereon/ssi-sdk.data-store";
import {IVerifiableCredential} from "@sphereon/ssi-types/src/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function convertPIDToUniformCredential(credentials: Array<any>): Promise<Array<UniformCredential>> {
    //fixme: we have a problem with crypto library that should be fixed when we update the sdk libs version. for now, we're assuming that sd-jwt credential that we have here is already decoded

    const result = credentials.map(async credential => {
        if (CredentialMapper.isSdJwtEncoded(credential)) {
            // @ts-ignore
            const hasher = (data, algorithm) => {
                const sanitizedAlgorithm = algorithm.toLowerCase().replace(/[-_]/g, '')
                return crypto.createHash(sanitizedAlgorithm).update(data).digest();
            }
            // @ts-ignore
            const sdJwtDecodedVc: SdJwtDecodedVerifiableCredential = await CredentialMapper.decodeSdJwtVcAsync(credential as string, hasher)
            return {
                original: credential,
                subjectClaim: sdJwtDecodedVc.decodedPayload as Record<string, any>,
                transformedClaims: convertPIDSdJwtWellknownPayloadValues(sdJwtDecodedVc.decodedPayload)
            }
        }
        if (CredentialMapper.isMsoMdocOid4VPEncoded(credential)) {
            const wvp = CredentialMapper.toWrappedVerifiablePresentation(credential)
            if (!wvp.vcs || wvp.vcs.length == 0) {
                return Promise.reject('Missing decoded MDOC credential')
            }
            const decodedCredential = Object.values(wvp.vcs[0].decoded).reduce((acc, curr) => ({
                ...acc,
                ...(curr as Record<string, unknown>)
            }), {}) as Record<string, unknown>
            return {
                original: credential,
                subjectClaim: decodedCredential,
                transformedClaims: convertPIDMdocWellknownPayloadValues(decodedCredential)
            }
        }
        
        let uniformCredential: IVerifiableCredential
        if(CredentialMapper.isPresentation(credential)) {
            const wvp = CredentialMapper.toWrappedVerifiablePresentation(credential);
            if (!wvp.vcs || wvp.vcs.length == 0) {
                return Promise.reject('Missing decoded credential')
            }
            const decodedCredential = wvp.vcs[0].credential as any // FIXME
            uniformCredential = CredentialMapper.toUniformCredential(decodedCredential);
        } else {
            uniformCredential = CredentialMapper.toUniformCredential(credential);
        }
        const credentialSummary = await toNonPersistedCredentialSummary({
            verifiableCredential: uniformCredential as VerifiableCredential,
            credentialRole: CredentialRole.HOLDER
        })
        return {
            original: credential,
            subjectClaim: uniformCredential.credentialSubject as Record<string, unknown>,
            transformedClaims: convertPIDUniformVCWellknownPayloadValues(credentialSummary.properties)
        }
    })
    return Promise.all(result)
}

/**
 * This function reduces the payload to show only the important parts of the claims in a human-readable fashion. We're doing this with keeping the pid credential in mind
 * @param payload
 */
function convertPIDSdJwtWellknownPayloadValues(payload: Record<string, any>) {
    const humanReadablePayload: Record<string, any> = {}

    const exclusions: string[] = ['vct', 'iss', 'exp', 'iat', 'cnf', 'age_equal_or_over']

    const isAgeKey = (key: string): boolean => !isNaN(Number(key))

    const numericAgeKeys: number[] = []

    for (const [key, value] of Object.entries(payload)) {
        if (exclusions.includes(key)) {
            continue
        }

        if (isAgeKey(key)) {
            numericAgeKeys.push(Number(key))
        } else {
            const humanReadableKey = toHumanReadable(key)

            if (Array.isArray(value)) {
                value.forEach(arrayElem => {
                    if (typeof arrayElem === 'object') {
                        if (arrayElem !== null && Object.keys(arrayElem).length > 0) {
                            humanReadablePayload[humanReadableKey] = convertPIDSdJwtWellknownPayloadValues(arrayElem)
                        }
                    } else if (typeof (arrayElem) !== 'string' || arrayElem !== '') {
                        humanReadablePayload[humanReadableKey] = convertToString(arrayElem)
                    }
                })
            } else if (typeof value === 'object') {
                if (value !== null && Object.keys(value).length > 0) {
                    humanReadablePayload[humanReadableKey] = convertPIDSdJwtWellknownPayloadValues(value)
                }
            } else {
                if (typeof (value) !== 'string' || value !== '') {
                    humanReadablePayload[humanReadableKey] = convertToString(value)
                }
            }
        }
    }

    if (numericAgeKeys.length > 0) {
        numericAgeKeys.sort((a, b) => a - b)
        const lowerLimit = numericAgeKeys[0]
        const upperLimit = numericAgeKeys[numericAgeKeys.length - 1]

        humanReadablePayload[`Age is above ${lowerLimit}`] = convertToString(payload[lowerLimit.toString()])
        humanReadablePayload[`Age is above ${upperLimit}`] = convertToString(payload[upperLimit.toString()])
    }

    if (payload.age_equal_or_over) {
        const ageKeys: number[] = Object.keys(payload.age_equal_or_over)
            .map(Number)
            .sort((a, b) => a - b)
        if (ageKeys.length > 0) {
            const lowerLimit: number = ageKeys[0]
            const upperLimit: number = ageKeys[ageKeys.length - 1]
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            humanReadablePayload[`Age is above ${lowerLimit}`] = convertToString(payload.age_equal_or_over[lowerLimit.toString()])
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            humanReadablePayload[`Age is above ${upperLimit}`] = convertToString(payload.age_equal_or_over[upperLimit.toString()])
        }
    }

    return humanReadablePayload
}

function convertToString(value: unknown): string {
    if (Array.isArray(value)) {
        return value.join(', ')
    }
    if (value === null || value === undefined) {
        return ''
    }
    let result = String(value);
    if(result.length > 50) {
        result = result.substring(0, 50) + '...'
    }
    return result
}

function toHumanReadable(key: string): string {
    key = key.charAt(0).toUpperCase() + key.slice(1)
    return key
        .split('_')
        .join(' ');
}

function convertPIDMdocWellknownPayloadValues(credential: Record<string, unknown>): Record<string, string> {
    const humanReadablePayload: Record<string, string> = {};

    const exclusions: string[] = ['docType', 'version', 'issuer', 'credentialID', 'issuance_date', 'expiry_date'];

    const isAgeKey = (key: string): boolean => key.startsWith("age_over_");

    const addressKeys: string[] = ['resident_street', 'resident_postal_code', 'resident_city'];
    const combinedAddress: string[] = [];
    const ageKeys: number[] = [];

    for (const [key, value] of Object.entries(credential)) {
        if (exclusions.includes(key)) {
            continue; // Skip the keys that are in the exclusions array
        }

        if (isAgeKey(key)) {
            ageKeys.push(Number(key.split("_")[2]));  // Collect age values
        } else if (addressKeys.includes(key)) {
            combinedAddress.push(convertToString(value)); // Collect address parts for later combination
        } else {
            const humanReadableKey = toHumanReadable(key);

            if (typeof value === 'object' && value !== null) {
                const concatenatedValues = Object.values(value)
                    .filter(part => part)
                    .join(', ');
                humanReadablePayload[humanReadableKey] = concatenatedValues;
            } else {
                humanReadablePayload[humanReadableKey] = convertToString(value);
            }
        }
    }

    // Add only the lowest and highest age keys
    if (ageKeys.length > 0) {
        ageKeys.sort((a, b) => a - b); // Sort age keys to find the lowest and highest
        const lowerLimit = ageKeys[0];
        const upperLimit = ageKeys[ageKeys.length - 1];

        humanReadablePayload[`Age is over ${lowerLimit}`] = convertToString(credential[`age_over_${lowerLimit}`]);
        humanReadablePayload[`Age is over ${upperLimit}`] = convertToString(credential[`age_over_${upperLimit}`]);
    }

    // Combine address parts into a single string if any address-related keys were found
    if (combinedAddress.length > 0) {
        humanReadablePayload["Address"] = combinedAddress.join(', ');
    }

    return humanReadablePayload;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function isMdoc(credential: any) {
    return 'docType' in credential && credential['docType'] === 'org.iso.18013.5.1.mDL'
}

function convertPIDUniformVCWellknownPayloadValues(properties: CredentialDetailsRow[]) {
    const humanReadablePayload: Record<string, string> = {};

    const keyMappings: Record<string, string> = {
        "issuing_country": "Issuing Country",
        "issuing_authority": "Issuing Authority",
        "given_name": "Given Name",
        "family_name": "Family Name",
        "birth_family_name": "Birth Family Name",
        "birthdate": "Date of Birth",
        "place_of_birth": "Place of Birth",
        "nationalities": "Nationalities",
    };

    properties.forEach(property => {
        const {id, label, value} = property;
        if(label && label.toLowerCase() === 'subject') {
            return
        }

        if (keyMappings[id]) {
            humanReadablePayload[keyMappings[id]] = convertToString(value);
        } else if (id === "age_equal_or_over" && typeof value === "object" && value !== null) {
            const ageKeys = Object.keys(value).map(Number).sort((a, b) => a - b);
            const lowerLimit = ageKeys[0];
            const upperLimit = ageKeys[ageKeys.length - 1];

            humanReadablePayload[`Age is above ${lowerLimit}`] = value[lowerLimit.toString()];
            humanReadablePayload[`Age is above ${upperLimit}`] = value[upperLimit.toString()];
        } else if (id === "address" && typeof value === "object" && value !== null) {
            const {street_address, locality, postal_code} = value;
            const addressParts = [street_address, postal_code, locality].filter(part => part);
            humanReadablePayload["Address"] = addressParts.join(', ');
        } else {
            humanReadablePayload[formatTitle(label ?? id)] = convertToString(value);
        }
    });

    return humanReadablePayload;
}


// Words that shouldn't be capitalized in titles (unless they're the first word)
const lowercaseWords = new Set([
    'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from',
    'in', 'into', 'near', 'nor', 'of', 'on', 'onto', 'or',
    'the', 'to', 'with'
])

export function formatTitle(str: string): string {
    const words = str
        // Replace both hyphens and underscores with spaces
        .replace(/[-_]/g, ' ')
        .toLowerCase()
        .split(' ')

    return words
        .map((word, index) => {
            // Always capitalize first word and words not in exception list
            if (index === 0 || !lowercaseWords.has(word)) {
                return word.charAt(0).toUpperCase() + word.slice(1)
            }
            return word
        })
        .join(' ')
}
