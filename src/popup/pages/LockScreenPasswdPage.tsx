import { useState } from 'react'
import { storageKeyLockPasswd } from '../constants/storage'
import { Button, CssBaseline, TextField, Typography } from '@mui/material'
import LockPersonRoundedIcon from '@mui/icons-material/LockPersonRounded'

export default function LockScreenPasswdPage(props: { onSetting: () => void }) {
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const [error, setError] = useState('')


  const handleP1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    const inputP1 = e.target.value
    setP1(inputP1)
    if (inputP1.length < 6) {
      setError('password must be at least 6 characters long')
    }
  }

  const handleP2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    const inputP2 = e.target.value
    setP2(inputP2)
    if (inputP2 !== p1) {
      setError('Passwords do not match')
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (p1 != p2) {
      setError('Passwords do not match')
      return
    }
    localStorage.setItem(storageKeyLockPasswd, p1)
    props.onSetting()
  }

  return (
    <>
      <CssBaseline />
      <LockPersonRoundedIcon fontSize='large' sx={{ mt: '30px' }} />
      <Typography variant="h6" gutterBottom sx={{ mt: '10px', mb: '25px' }}>
        Setup Lock Screen Password
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Enter password"
          variant="outlined"
          value={p1}
          onChange={handleP1Change}
          error={!!error}
          helperText={error}
          type="password"
          sx={{ width: '90%', marginTop: '20px' }}
        />
        <TextField
          label="Confirm password"
          variant="outlined"
          value={p2}
          onChange={handleP2Change}
          error={!!error}
          helperText={error}
          type="password"
          sx={{ width: '90%', marginTop: '20px' }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            marginTop: '100px',
            width: '88%',
            height: '45px',
            fontSize: '15px',
            borderRadius: '18px'
          }}
          disabled={!p1 || !p2}>
          Submit
        </Button>

      </form>

    </>
  )
}