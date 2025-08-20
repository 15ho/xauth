import { useState, useEffect } from 'react'
import TOTPCard, { TOTPKey, TOTPAlg, checkTotpKey } from '@/components/TOTPCard.tsx'
import { itemTOTPKeys } from '../constants/storage'

type TOTPKeys = {
	[key: string]: TOTPKey
}

export default function TOTPPage() {
	const [displayImportKey, setDisplayImportKey] = useState(false)
	const [totpKeys, setTOTPKeys] = useState<TOTPKeys>({})
	const [error, setError] = useState('')

	useEffect(() => {
		const storageKeys = localStorage.getItem(itemTOTPKeys)
		if (storageKeys) {
			setTOTPKeys(JSON.parse(storageKeys) as TOTPKeys)
		}
	}, [])

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const label = formData.get('label') as string
		const secret = formData.get('secret') as string
		const alg = formData.get('alg') as TOTPAlg

		if (label in totpKeys) {
			setError('Key already exists')
			return
		}
		const totpKey = {
			label,
			secret,
			alg,
		}

		if (!checkTotpKey(totpKey)) {
			setError('Invalid key')
			return
		}

		totpKeys[label] = totpKey
		localStorage.setItem('totpKeys', JSON.stringify(totpKeys))
		setDisplayImportKey(false)
	}

	return (
		<div>
			{displayImportKey ?
				(
					<div>
						<form onSubmit={handleSubmit}>
							<input type="text" placeholder="Label" name='label' required onChange={() => setError('')} />
							<input type="password" placeholder="Secret" name='secret' required />
							<select name="alg">
								<option value="SHA-256" selected>SHA-256</option>
								<option value="SHA-512">SHA-512</option>
								<option value="SHA-1">SHA-1</option>
								<option value="SHA-224">SHA-224</option>
								<option value="SHA-384">SHA-384</option>
								<option value="SHA3-224">SHA3-224</option>
								<option value="SHA3-256">SHA3-256</option>
								<option value="SHA3-384">SHA3-384</option>
								<option value="SHA3-512">SHA3-512</option>
							</select>
							<button type="submit">Add</button>
							<button type="button" onClick={() => setDisplayImportKey(false)}>Cancel</button>
						</form>

						{error && <div className="error">{error}</div>}
					</div>)
				:
				(
					<div>
						<button onClick={() => setDisplayImportKey(true)} >Import Key</button>
						<hr />
						{Object.entries(totpKeys).map(([, key]) => <TOTPCard totpKey={key} />)}
					</div>
				)
			}
		</div>
	)
}
