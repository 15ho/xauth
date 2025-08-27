import { useState, useEffect } from 'react'
import AppPage from './pages/AppPage'
import LockScreenPage from './pages/LockScreenPage'
import './App.css'
import LockScreenPasswdPage from './pages/LockScreenPasswdPage'
import { storageKeyLockPasswd, storageKeyUnlockTime } from './constants/storage'

export default function App() {
  const [lockPasswdConfigured, setLockPasswdConfigured] = useState(false)
  const [lockScreen, setLockScreen] = useState(true)
  const autoLockInterval = 1000 * 60 * 5 // 5 minutes

  useEffect(() => {
    const storageLockPasswd = localStorage.getItem(storageKeyLockPasswd)
    if (storageLockPasswd) {
      setLockPasswdConfigured(true)
    }
    const storageUnlockTime = localStorage.getItem(storageKeyUnlockTime)
    if (storageUnlockTime) {
      const unlockTime = parseInt(storageUnlockTime)
      if (unlockTime + autoLockInterval > Date.now()) {
        setLockScreen(false)
      }
    }
  }, [])

  const handleUnlock = () => {
    setLockScreen(false)
    localStorage.setItem(storageKeyUnlockTime, Date.now().toString())
  }

  const handleLockScreen = () => {
    setLockScreen(true)
    localStorage.removeItem(storageKeyUnlockTime)
  }

  const handleSetting = () => {
    setLockPasswdConfigured(true)
  }

  return (
    <>
      {
        lockPasswdConfigured ?
          (lockScreen ?
            (<LockScreenPage onUnlock={handleUnlock} />)
            :
            (
              <AppPage handleLockScreen={handleLockScreen} />
            ))
          :
          (<LockScreenPasswdPage onSetting={handleSetting} />)
      }
    </>
  )
}