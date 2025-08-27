import * as OTPAuth from "otpauth"
import CryptoJS from "crypto-js"

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