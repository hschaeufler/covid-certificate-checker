export interface CoseMessageModel {
    protectHeader: Uint8Array,
    unprotectHeader: Object,
    payload: Uint8Array,
    sig: Uint8Array
}