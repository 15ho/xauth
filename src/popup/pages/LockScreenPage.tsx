import { useState } from 'react'
import { storageKeyLockPasswd } from '../constants/storage'

export default function LockScreenPage(props: { onUnlock: () => void }) {
	const [passwd, setPasswd] = useState('')
	const [error, setError] = useState('')

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const storagePasswd = localStorage.getItem(storageKeyLockPasswd)
		if (!storagePasswd) {
			return
		}
		if (storagePasswd !== passwd) {
			setError('Invalid password')
			return
		}
		props.onUnlock()
	}

	return (
		<div className="auth-container">
			<div className="auth-box">
				<h1> Your TOTP Authenticator </h1>

				<form onSubmit={handleSubmit}>
					<div className="input-group">
						<input
							type="password"
							onChange={(e) => {
								setPasswd(e.target.value)
								setError('')
							}}
							placeholder="Please enter your password"
							required
						/>
						<button type="submit">Unlock</button>
					</div>

					{error && <div className="error">{error}</div>}
				</form>

			</div>
		</div>
	)
}