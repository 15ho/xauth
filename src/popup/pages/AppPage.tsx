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
import {
  Add as AddIcon,
  LockClockRounded as LockPersonRoundedIcon
} from '@mui/icons-material'
import { TOTPKey, checkTotpKey, parseTotpKeyUri } from '@/components/common'
import TOTPListItem from '@/components/TOTPListItem'
import { storageKeyTOTPKeys } from '../constants/storage'
import TOTPForm from '@/components/TOTPForm'

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


  useEffect(() => {
    const storageKeys = localStorage.getItem(storageKeyTOTPKeys)
    if (storageKeys) {
      const keys = JSON.parse(storageKeys) as Map<string, string>
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
    if (totpKeys && (totpKey.label in totpKeys)) {
      throw new Error('Key already exists')
    }

    if (!totpKeys) {
      const totpKeys = { [totpKey.label]: totpKey }
      const storageTotpKeys = { [totpKey.label]: totpKey.toString() }
      console.log('totpKeys', storageTotpKeys, JSON.stringify(storageTotpKeys))

      localStorage.setItem('totpKeys', JSON.stringify(storageTotpKeys))
      setTOTPKeys(totpKeys)
    } else {
      totpKeys[totpKey.label] = totpKey
      let storageTotpKeys: Record<string, string> = {}
      Object.entries(totpKeys).forEach(([k, v]) => {
        storageTotpKeys[k] = v.toString()
      });
      localStorage.setItem('totpKeys', JSON.stringify(storageTotpKeys))
    }

    setTotpKeyForm(false)
  }


  return (
    <>
      <CssBaseline />

      <Paper square sx={{ pb: 0, boxShadow: 'none' }}>
        {totpKeys &&
          <List sx={{ mb: 0, pb: 0 }}>
            {Object.entries(totpKeys).map(([, key]) => (
              <TOTPListItem totpKey={key} />
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

    </>
  )
}