import * as PassKit from './index'
import * as Format from 'dateformat'

/// Template
export default class Template {

    // Standard Keys
    description: string

    formatVersion: number = 1

    organizationName: string

    passTypeIdentifier: string

    serialNumber: string

    teamIdentifier: string

    // Associated App Keys
    appLaunchURL?: string

    associatedStoreIdentifiers?: number[]

    // Companion App Keys
    userInfo?: { [key: string]: Object }

    // Expiration Keys
    expirationDate?: Date

    voided?: boolean

    // Relevance Keys
    beacons?: PassKit.Beacon[]

    locations?: PassKit.Location[]

    maxDistance?: number

    relevantDate?: Date

    // Style Keys
    boardingPass?: PassKit.Pass

    coupon?: PassKit.Pass

    eventTicket?: PassKit.Pass

    generic?: PassKit.Pass

    storeCard?: PassKit.Pass

    // Visual Appearance Keys
    barcode?: PassKit.Barcode

    barcodes?: PassKit.Barcode[]

    backgroundColor?: PassKit.RGB

    foregroundColor?: PassKit.RGB

    groupingIdentifier?: string

    labelColor?: PassKit.RGB

    logoText?: string

    suppressStripShine?: boolean

    // Web Service Keys
    authenticationToken?: string

    webServiceURL?: string

    nfc?: PassKit.NFC

    /// constructor
    constructor(style: PassKit.Style, pass: PassKit.Pass, organizationName: string, description: string, serialNumber: string) {
        this.passTypeIdentifier = PassKit.certificates.options.passTypeIdentifier
        this.teamIdentifier = PassKit.certificates.options.teamIdentifier
        this.organizationName = organizationName
        this.description = description
        this.serialNumber = serialNumber
        switch (style) {
            case PassKit.Style.boardingPass: {
                this.boardingPass = pass
                break
            }
            case PassKit.Style.coupon: {
                this.coupon = pass
                break
            }
            case PassKit.Style.eventTicket: {
                this.eventTicket = pass
                break
            }
            case PassKit.Style.generic: {
                this.generic = pass
                break
            }
            case PassKit.Style.storeCard: {
                this.storeCard = pass
                break
            }
        }
    }

    validate() {

        // Required keys
        const requireKeys = [
            'description',
            'formatVersion',
            'organizationName',
            'passTypeIdentifier',
            'serialNumber',
            'teamIdentifier',
        ]
        for (const key of requireKeys) {
            if (!this[key]) {
                throw Error(`Missing ${key}, ${key} is required`)
            }
        }

        if (this.authenticationToken && this.authenticationToken.length < 16) {
            throw Error(`authenticationToken must be 16 characters or longer.`)
        }

        // ATS
        if (this['webServiceURL']) {
            if (this['webServiceURL'].includes('http:')) {
                throw Error(`webServiceURL must use https. ${this['webServiceURL']}`)
            }
        }
    }

    toPass(): { [key: string]: any } {

        this.validate()

        const pass: { [key: string]: any } = {}
        for (const key in this) {
            const value = this[key]
            if (value instanceof PassKit.RGB) {
                pass[key] = (value as PassKit.RGB).getValue()
            } else if (value instanceof Date) {
                pass[key] = Format((value as Date), 'isoUtcDateTime')
            } else {
                pass[key] = value
            }
        }
        return pass
    }
}