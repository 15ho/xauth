import React, { useState } from 'react'
import {
  Dialog,
  DialogActions,
  TextField,
  Button,
  styled,

  Paper,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { TOTPKey, parseTotpKey } from './common'

const BlurredDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-container': {
    backdropFilter: 'blur(4px)',
    backgroundColor: alpha(theme.palette.common.white, 0.5),
  },
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[24],
  },
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  fontSize: '10px',
  marginTop: theme.spacing(1),
}))

export default function TOTPEnterForm(props: { onClose: () => void, onSubmit: (totpKey: TOTPKey) => void }) {

  const [issuer, setIssuer] = useState<string>('')
  const [label, setLabel] = useState<string>('')
  const [secret, setSecret] = useState<string>('')
  const [digits, setDigits] = useState<number>(6)
  const [period, setPeriod] = useState<number>(30)
  const [algorithm, setAlgorithm] = useState<string>("SHA1")
  const [error, setError] = useState<string>('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const formData = parseTotpKey(issuer, label, algorithm, digits, period, secret)
      props.onSubmit(formData)
    } catch (error) {
      setError('Import key failed:' + error)
      return
    }
    props.onClose()
  }

  return (
    <BlurredDialog
      open={true}
      onClose={(props.onClose)}
      slotProps={{
        backdrop: {
          style: {
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
          }
        },
        paper: {
          style: {
            overflowY: 'hidden',
          }
        }
      }}
    >

      <form onSubmit={handleSubmit}>
        <StyledPaper>
          <StyledTextField
            label="Issuer"
            value={issuer}
            onChange={(e) => {
              setError('')
              setIssuer(e.target.value)
            }}
          />
          <StyledTextField
            label="Label"
            value={label}
            onChange={(e) => {
              setError('')
              setLabel(e.target.value)
            }}
            required
          />
          <StyledTextField
            label="Secret"
            value={secret}
            onChange={(e) => {
              setError('')
              setSecret(e.target.value)
            }}
            required
          />
          <StyledTextField
            label="Digits"
            value={digits}
            onChange={(e) => {
              setError('')
              setDigits(parseInt(e.target.value))
            }}
            required
          />
          <StyledTextField
            label="Period"
            value={period}
            onChange={(e) => {
              setError('')
              setPeriod(parseInt(e.target.value))
            }}
            required
          />
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>Algorithm</InputLabel>
            <Select
              label="Algorithm"
              value={algorithm}
              onChange={(e) => {
                setError('')
                setAlgorithm(e.target.value)
              }}
              required
            >
              <MenuItem value={"SHA1"}>SHA1</MenuItem>
              <MenuItem value={"SHA224"}>SHA224</MenuItem>
              <MenuItem value={"SHA256"}>SHA256</MenuItem>
              <MenuItem value={"SHA384"}>SHA384</MenuItem>
              <MenuItem value={"SHA512"}>SHA512</MenuItem>
              <MenuItem value={"SHA3-224"}>SHA3-224</MenuItem>
              <MenuItem value={"SHA3-256"}>SHA3-256</MenuItem>
              <MenuItem value={"SHA3-384"}>SHA3-384</MenuItem>
              <MenuItem value={"SHA3-512"}>SHA3-512</MenuItem>
            </Select>
          </FormControl>
          {error && (
            <Typography variant="body2" color="error" sx={{ my: 2 }}>
              {error}
            </Typography>
          )}
        </StyledPaper>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={props.onClose}>cancel</Button>
          <Button type="submit" variant="contained" disabled={!secret || !label || !digits || !period || !algorithm || error !== ''}>
            Submit
          </Button>
        </DialogActions>
      </form>
    </BlurredDialog>
  )
}