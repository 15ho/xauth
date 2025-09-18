import { useState } from 'react'
import { storageKeyLockPasswd } from '../constants/storage'
import { Button, CssBaseline, TextField, Typography } from '@mui/material'
import { encryptPasswd } from '@/components/common'

export default function LockScreenPage(props: { onUnlock: () => void }) {
  const [passwd, setPasswd] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const storagePasswd = localStorage.getItem(storageKeyLockPasswd)
    if (!storagePasswd) {
      return
    }
    if (storagePasswd !== encryptPasswd(passwd)) {
      setError('Invalid password')
      return
    }
    props.onUnlock()
  }

  return (
    <>
      <CssBaseline />
      <Typography variant="h2" gutterBottom sx={{ mt: '40px', mb: '20px' }}>
        XAuth
      </Typography>

      <form onSubmit={handleSubmit} style={{ marginTop: '108px' }}>
        <TextField
          label="Enter your password"
          variant="outlined"
          value={passwd}
          onChange={(e) => {
            setPasswd(e.target.value)
          }}
          error={!!error}
          helperText={error}
          type="password"
          sx={{ width: '90%' }}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            marginTop: '168px',
            width: '88%',
            height: '45px',
            fontSize: '15px',
            borderRadius: '18px'
          }}
          disabled={!passwd}>
          Unlock
        </Button>

      </form>
    </>
  )
}