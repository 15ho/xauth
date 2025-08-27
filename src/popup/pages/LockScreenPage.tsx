import { useState } from 'react'
import { storageKeyLockPasswd } from '../constants/storage'
import { Button, CssBaseline, TextField } from '@mui/material'

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
    <>
      <CssBaseline />
      <h1> XAuth </h1>

      <form onSubmit={handleSubmit} style={{ marginTop: '100px' }}>
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
            marginTop: '160px',
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