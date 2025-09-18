import * as OTPAuth from "otpauth"
import CryptoJS from "crypto-js"

export type TOTPKey = OTPAuth.TOTP

export function parseTotpKeyUri(totpKeyUri: string): TOTPKey | undefined {
  try {
    const otpObj = OTPAuth.URI.parse(totpKeyUri)
    return otpObj instanceof OTPAuth.TOTP ? otpObj : undefined
  } catch (e) {
    return undefined
  }
}

export function parseTotpKey(issuer?: string, label?: string, algorithm?: string, digits?: number, period?: number, secret?: string): TOTPKey {
  if (!label) {
    throw new Error('label is empty')
  }
  if (!algorithm) {
    throw new Error('algorithm is empty')
  }
  if (!digits) {
    throw new Error('digits is empty')
  }
  if (!period) {
    throw new Error('period is empty')
  }
  if (!secret) {
    throw new Error('secret is empty')
  }

  return new OTPAuth.TOTP({
    // Provider or service the account is associated with.
    issuer: issuer,
    // Account identifier.
    label: label,
    // Algorithm used for the HMAC function, possible values are:
    //   "SHA1", "SHA224", "SHA256", "SHA384", "SHA512",
    //   "SHA3-224", "SHA3-256", "SHA3-384" and "SHA3-512".
    algorithm: algorithm,
    // Length of the generated tokens.
    digits: digits,
    // Interval of time for which a token is valid, in seconds.
    period: period,
    // Arbitrary key encoded in base32 or `OTPAuth.Secret` instance
    // (if omitted, a cryptographically secure random secret is generated).
    secret: secret,
    //   or: `OTPAuth.Secret.fromBase32("US3WHSG7X5KAPV27VANWKQHF3SH3HULL")`
    //   or: `new OTPAuth.Secret()`
  })
}

export function encryptPasswd(passwd: string) {
  return CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(passwd))
}

export function aseEncrypt(plainText: string, encPasswd: string): string {
  const passwd = CryptoJS.enc.Base64.parse(encPasswd).toString()
  return CryptoJS.AES.encrypt(plainText, passwd).toString()
}

export function aseDecrypt(cipherText: string, encPasswd: string): string {
  const passwd = CryptoJS.enc.Base64.parse(encPasswd).toString()
  return CryptoJS.AES.decrypt(cipherText, passwd).toString(CryptoJS.enc.Utf8)
}