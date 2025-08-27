import * as OTPAuth from "otpauth"

export type TOTPKey = OTPAuth.TOTP

export function checkTotpKey(totpKey: TOTPKey) {
  try {
    return totpKey.generate() !== ''
  } catch (e) {
    return false
  }
}

export function parseTotpKeyUri(totpKeyUri: string): TOTPKey | undefined {
  try {
    const otpObj = OTPAuth.URI.parse(totpKeyUri)
    return otpObj instanceof OTPAuth.TOTP ? otpObj : undefined
  } catch (e) {
    return undefined
  }
}