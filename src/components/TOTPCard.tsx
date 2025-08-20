import { useState, useEffect } from 'react'
import { TOTP } from 'totp-generator'

export type TOTPAlg = "SHA-256" | "SHA-512" | "SHA-1" | "SHA-224" | "SHA-384" | "SHA3-224" | "SHA3-256" | "SHA3-384" | "SHA3-512"

export type TOTPKey = {
	label: string,
	secret: string,
	alg: TOTPAlg,
}

export function checkTotpKey(totpKey: TOTPKey) {
	const { label, secret, alg } = totpKey
	if (!label || !secret || !alg) {
		return false
	}
	try {
		TOTP.generate(totpKey.secret, { period: 60, algorithm: totpKey.alg })
	} catch (e) {
		return false
	}
	return true
}

export default function TOTPCard(props: { totpKey: TOTPKey }) {
	const totpperiod = 60
	const [otpRes, setOtpRes] = useState({ otp: '', expires: 0 })
	const [countdown, setCountdown] = useState(0)

	useEffect(() => {
		console.log('TOTPKey', props.totpKey)
		const timer = setInterval(() => {
			setOtpRes(r => {
				if (Date.now() >= r.expires) {
					const rr = TOTP.generate(props.totpKey.secret, { period: totpperiod, algorithm: props.totpKey.alg })
					setCountdown(Math.round(Math.abs((rr.expires - Date.now()) / 1000)))
					return rr
				}
				return r
			})
			setCountdown(c => c - 1)
		}, 1000)
		return () => {
			clearInterval(timer)
		}
	}, [])

	return (
		<div>
			[{props.totpKey.label}] <b>{otpRes.otp}</b> {countdown}
		</div>
	)
}
