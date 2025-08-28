import { useEffect, useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  styled,
  Fab,
  CssBaseline,
  Paper,
  List,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import LockPersonRoundedIcon from '@mui/icons-material/LockPersonRounded'
import { TOTPKey, aseDecrypt, aseEncrypt, checkTotpKey, encryptPasswd, parseTotpKeyUri } from '@/components/common'
import TOTPListItem from '@/components/TOTPListItem'
import { storageKeyLockPasswd, storageKeyTOTPKeys } from '../constants/storage'
import TOTPForm from '@/components/TOTPForm'
import ConfirmDialog from '@/components/ConfirmDialog'

const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: '0 auto',
})

type TOTPKeys = {
  [key: string]: TOTPKey
}

export default function AppPage(props: { handleLockScreen: () => void }) {
  const [totpKeyForm, setTotpKeyForm] = useState(false)
  const [totpKeys, setTOTPKeys] = useState<TOTPKeys>()
  const [delTotpKeyConfirmDialog, setDelTotpKeyConfirmDialog] = useState(false)
  const [delTotpKeyLabel, setDelTotpKeyLabel] = useState('')


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
        if (totpKey && checkTotpKey(totpKey)) {
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
    setTotpKeyForm(false)
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


  return (
    <>
      <CssBaseline />

      <Paper square sx={{ pb: 0, boxShadow: 'none' }}>
        {totpKeys &&
          <List sx={{ mb: 0, pt: 0, pb: '80px' }}>
            {Object.entries(totpKeys).map(([, key]) => (
              <TOTPListItem totpKey={key} onContextMenu={() => { setDelTotpKeyConfirmDialog(true), setDelTotpKeyLabel(key.label) }} />
            ))}
          </List>}
      </Paper>

      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <StyledFab color="secondary" aria-label="add" onClick={() => setTotpKeyForm(true)}>
            <AddIcon />
          </StyledFab>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit" onClick={() => props.handleLockScreen()}>
            <LockPersonRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {totpKeyForm && (<TOTPForm onClose={() => setTotpKeyForm(false)} onSubmit={handleSubmit} />)}

      {delTotpKeyConfirmDialog &&
        delTotpKeyLabel &&
        (<ConfirmDialog confirmMsg={`Are you sure to delete "${delTotpKeyLabel}"?`} onClick={handleDelTOTPKey} />)}

    </>
  )
}