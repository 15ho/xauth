import { useState } from 'react'
import { itemLockPasswd } from '../constants/storage'

export default function LockScreenPasswdPage(props: { onSetting: () => void }) {
	const [p1, setP1] = useState('')
	const [p2, setP2] = useState('')
	const [error, setError] = useState('')


	const handleP1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
		setError('')
		const inputP1 = e.target.value
		if (inputP1.length < 6) {
			setError('password must be at least 6 characters long')
			return
		}
		setP1(inputP1)
	}

	const handleP2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
		setError('')
		const inputP2 = e.target.value
		if (inputP2 !== p1) {
			setError('Passwords do not match')
			return
		}
		setP2(inputP2)
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (p1 != p2) {
			setError('Passwords do not match')
			return
		}
		localStorage.setItem(itemLockPasswd, p1)
		props.onSetting()
	}

	return (
		<div className="auth-container">
			<div className="auth-box">
				<h1> Set your lock screen password </h1>

				<form onSubmit={handleSubmit}>
					<div className="input-group">
						<input
							type="password"
							name="p1"
							onChange={handleP1Change}
							placeholder="password"
							required
						/>
						<input
							type="password"
							name="p2"
							onChange={handleP2Change}
							placeholder="confirm password"
							required
						/>
						<button type="submit">Submit</button>
					</div>

					{error && <div className="error">{error}</div>}
				</form>

			</div>
		</div>
	)
}