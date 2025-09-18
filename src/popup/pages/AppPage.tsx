import { useEffect, useState } from 'react'
import {
  CssBaseline,
  Paper,
  List,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from '@mui/material'
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import LockPersonRoundedIcon from '@mui/icons-material/LockPersonRounded'
import { TOTPKey, aseDecrypt, aseEncrypt, encryptPasswd, parseTotpKeyUri } from '@/components/common'
import TOTPListItem from '@/components/TOTPListItem'
import { storageKeyLockPasswd, storageKeyTOTPKeys } from '../constants/storage'
import TOTPParseForm from '@/components/TOTPParseForm'
import ConfirmDialog from '@/components/ConfirmDialog'
import TOTPEnterForm from '@/components/TOTPEnterForm'

type TOTPKeys = {
  [key: string]: TOTPKey
}

export default function AppPage(props: { handleLockScreen: () => void }) {
  const [totpKeyParseForm, setTotpKeyParseForm] = useState(false)
  const [totpKeyEnterForm, setTotpKeyEnterForm] = useState(false)
  const [totpKeys, setTOTPKeys] = useState<TOTPKeys>()
  const [delTotpKeyConfirmDialog, setDelTotpKeyConfirmDialog] = useState(false)
  const [delTotpKeyLabel, setDelTotpKeyLabel] = useState('')
  const [openMenus, setOpenMenus] = useState(false)


  useEffect(() => {
    const storageLockPasswd = localStorage.getItem(storageKeyLockPasswd)
    if (!storageLockPasswd) {
      throw new Error('Lock screen password not set')
    }
    const storageKeys = localStorage.getItem(storageKeyTOTPKeys)
    if (storageKeys) {
      const keys = JSON.parse(aseDecrypt(storageKeys, storageLockPasswd)) as Map<string, string>
      let kkeys: TOTPKeys = {}
      Object.entries(keys).forEach(([, v]) => {
        const totpKey = parseTotpKeyUri(v)
        if (totpKey) {
          kkeys[totpKey.label] = totpKey
        }
      })
      setTOTPKeys(kkeys)
    }
  }, [])

  const handleSubmit = (totpKey: TOTPKey) => {
    const storageLockPasswd = localStorage.getItem(storageKeyLockPasswd)
    if (!storageLockPasswd) {
      throw new Error('Lock screen password not set')
    }

    if (totpKeys && (totpKey.label in totpKeys)) {
      throw new Error('Key already exists')
    }

    if (!totpKeys) {
      const totpKeys = { [totpKey.label]: totpKey }
      const storageTotpKeys = { [totpKey.label]: totpKey.toString() }

      localStorage.setItem('totpKeys', aseEncrypt(JSON.stringify(storageTotpKeys), storageLockPasswd))
      setTOTPKeys(totpKeys)
    } else {
      totpKeys[totpKey.label] = totpKey
      let storageTotpKeys: Record<string, string> = {}
      Object.entries(totpKeys).forEach(([k, v]) => {
        storageTotpKeys[k] = v.toString()
      });
      localStorage.setItem('totpKeys', aseEncrypt(JSON.stringify(storageTotpKeys), storageLockPasswd))
    }
    setTotpKeyParseForm(false)
  }

  const handleDelTOTPKey = (confirm: boolean, password: string) => {
    if (!confirm) {
      setDelTotpKeyConfirmDialog(false)
      setDelTotpKeyLabel('')
      return
    }

    const storageLockPasswd = localStorage.getItem(storageKeyLockPasswd)
    if (!storageLockPasswd) {
      throw new Error('Lock screen password not set')
    }
    if (encryptPasswd(password) !== storageLockPasswd) {
      throw new Error('Invalid password')
    }

    const storageKeys = localStorage.getItem(storageKeyTOTPKeys)
    if (storageKeys) {
      const keys = JSON.parse(aseDecrypt(storageKeys, storageLockPasswd)) as Map<string, string>
      let kkeys: TOTPKeys = {}
      let storageKKeys: Record<string, string> = {}
      Object.entries(keys).forEach(([, v]) => {
        const totpKey = parseTotpKeyUri(v)
        if (totpKey && totpKey.label !== delTotpKeyLabel) {
          kkeys[totpKey.label] = totpKey
          storageKKeys[totpKey.label] = totpKey.toString()
        }
      })
      setTOTPKeys(kkeys)
      localStorage.setItem('totpKeys', aseEncrypt(JSON.stringify(storageKKeys), storageLockPasswd))
    }

    setDelTotpKeyConfirmDialog(false)
    setDelTotpKeyLabel('')
  }

  const actions = [
    { icon: <KeyboardIcon />, name: 'Enter a setup key', onClick: () => setTotpKeyEnterForm(true) },
    { icon: <CameraAltIcon />, name: 'Add key from QR code', onClick: () => setTotpKeyParseForm(true) },
    { icon: <LockPersonRoundedIcon />, name: 'Lock Screen', onClick: () => props.handleLockScreen() },
  ];


  return (
    <>
      <CssBaseline />

      <Paper square sx={{ pb: 0, boxShadow: 'none' }}>
        {totpKeys &&
          <List sx={{ mb: 0, pt: 0, pb: '80px' }}>
            {Object.entries(totpKeys).map(([, v]) => (
              <TOTPListItem
                // FIX: Each child in a list should have a unique "key" prop.%s%s 
                // See https://react.dev/link/warning-keys for more information
                // Check the render method of `ul`. It was passed a child from AppPage.
                key={v.label}
                totpKey={v}
                onContextMenu={() => { setDelTotpKeyConfirmDialog(true), setDelTotpKeyLabel(v.label) }}
              />
            ))}
          </List>}
      </Paper>

      <SpeedDial
        ariaLabel="Menus"
        sx={{ position: 'fixed', bottom: 50, right: 30 }}
        icon={<SpeedDialIcon />}
        onClose={() => setOpenMenus(false)}
        onOpen={() => setOpenMenus(true)}
        open={openMenus}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            color='secondary'
            slotProps={{
              tooltip: {
                title: action.name,
              },
            }}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>

      {totpKeyParseForm && (<TOTPParseForm onClose={() => setTotpKeyParseForm(false)} onSubmit={handleSubmit} />)}

      {totpKeyEnterForm && (<TOTPEnterForm onClose={() => setTotpKeyEnterForm(false)} onSubmit={handleSubmit} />)}

      {delTotpKeyConfirmDialog &&
        delTotpKeyLabel &&
        (<ConfirmDialog confirmMsg={`Are you sure to delete "${delTotpKeyLabel}"?`} onClick={handleDelTOTPKey} />)}

    </>
  )
}