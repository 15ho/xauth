import { useState, useEffect } from 'react'
import TOTPPage from './pages/TOTPPage.tsx'
import LockScreenPage from './pages/LockScreenPage.tsx'
import './App.css'
import LockScreenPasswdPage from './pages/LockScreenPasswdPage.tsx'
import { itemLockPasswd, itemUnlockTime } from './constants/storage'

export default function App() {
	const [lockPasswdConfigured, setLockPasswdConfigured] = useState(false)
	const [lockScreen, setLockScreen] = useState(true)
	const autoLockInterval = 1000 * 60 * 5 // 5 minutes

	useEffect(() => {
		const storageLockPasswd = localStorage.getItem(itemLockPasswd)
		if (storageLockPasswd) {
			setLockPasswdConfigured(true)
		}
		const storageUnlockTime = localStorage.getItem(itemUnlockTime)
		if (storageUnlockTime) {
			const unlockTime = parseInt(storageUnlockTime)
			if (unlockTime + autoLockInterval > Date.now()) {
				setLockScreen(false)
			}
		}
	}, [])

	const handleUnlock = () => {
		setLockScreen(false)
		localStorage.setItem(itemUnlockTime, Date.now().toString())
	}

	const handleSetting = () => {
		setLockPasswdConfigured(true)
	}

	const handleLock = () => {
		setLockScreen(true)
		localStorage.removeItem(itemUnlockTime)
	}

	return (
		<div>
			{
				lockPasswdConfigured ?
					(lockScreen ?
						(<LockScreenPage onUnlock={handleUnlock} />)
						:
						(
							<div>
								<h1> TOTP Codes </h1>
								<TOTPPage />
								<hr />
								<button onClick={handleLock}>Lock Screen</button>
							</div>
						))
					:
					(<LockScreenPasswdPage onSetting={handleSetting} />)
			}
		</div>
	)
}