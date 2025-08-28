import * as common from './common'
import { describe, expect, it } from 'vitest'

describe('parseTotpKeyUri', () => {
  it('validated totp key', () => {
    // full uri
    const res = common.parseTotpKeyUri('otpauth://totp/test?secret=JBSWY3DPEHPK3PXP&issuer=testIssuer&algorithm=SHA256&digits=8&period=60')
    expect(res).toBeTruthy()
    if (res) {
      expect(res.label).toBe('test')
      expect(res.secret.base32).toBe('JBSWY3DPEHPK3PXP')
      expect(res.algorithm).toBe('SHA256')
      expect(res.digits).toBe(8)
      expect(res.period).toBe(60)
      expect(res.issuer).toBe('testIssuer')
    }
    // short uri
    const res2 = common.parseTotpKeyUri('otpauth://totp/test?secret=JBSWY3DPEHPK3PXP')
    expect(res2).toBeTruthy()
    if (res2) {
      expect(res2.label).toBe('test')
      expect(res2.secret.base32).toBe('JBSWY3DPEHPK3PXP')
      expect(res2.algorithm).toBe('SHA1')
      expect(res2.digits).toBe(6)
      expect(res2.period).toBe(30)
      expect(res2.issuer).toBe('')
    }
  })

  it('invalidated totp key', () => {
    // invalid uri // require label
    expect(common.parseTotpKeyUri('otpauth://totp/?secret=JBSWY3DPEHPK3PXP')).toBeFalsy()
    // invalid secret
    expect(common.parseTotpKeyUri('otpauth://totp/test?secret=123&issuer=testIssuer&algorithm=SHA256&digits=8&period=60')).toBeFalsy()
    // invalid algorithm
    expect(common.parseTotpKeyUri('otpauth://totp/test?secret=JBSWY3DPEHPK3PXP&issuer=testIssuer&algorithm=SHA111&digits=8&period=60')).toBeFalsy()
  })
})


describe('crypto', () => {
  it('encrypt password', () => {
    const res = common.encryptPasswd('123456')
    expect(res).toBeTruthy()
    expect(res).toBe('jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI=')
  })

  it('ase', () => {
    const passwd = '41FHd18273'
    const msg = 'hello world'
    const res = common.aseEncrypt(msg, passwd)
    expect(res).toBeTruthy()
    const res2 = common.aseDecrypt(res, '41FHd18273')
    expect(res2).toBe(msg)
  })
})
