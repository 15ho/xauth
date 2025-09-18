import {
  Alert,
  AlertColor,
  CircularProgress,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography
} from '@mui/material'
import { useState, useEffect } from 'react'
import { TOTPKey } from './common'

export default function TOTPListItem(props: { totpKey: TOTPKey, onContextMenu: () => void }) {
  const [otpRes, setOtpRes] = useState({ otp: '', counter: 0 })
  const [progress, setProgress] = useState(0)
  const [alertRes, setAlertRes] = useState<{
    msg: string,
    level: AlertColor
  } | undefined>(undefined) // info, warn, success(default)

  useEffect(() => {
    const timer = setInterval(() => {
      setOtpRes(r => {
        const counter = props.totpKey.counter()
        if (counter > r.counter) {
          const otp = props.totpKey.generate()
          const countdown = props.totpKey.remaining() / 1000
          setProgress(countdown / props.totpKey.period * 100)
          return { otp, counter }
        }
        return r
      })
      setProgress(p => p - 100 / props.totpKey.period)
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  const handleCopyOtp = () => {
    navigator.clipboard.writeText(otpRes.otp)
    setAlertRes({ msg: 'Copied', level: 'success' })
    setTimeout(() => {
      setAlertRes(undefined)
    }, 2000)
  }

  return (
    <>
      {alertRes && (<Alert variant='standard' severity={alertRes.level} >{alertRes.msg}</Alert>)}
      <ListItemButton
        sx={{
          width: '320px',
          height: '95px',
          boxShadow: 'var(--Paper-shadow)'
        }}
        onClick={handleCopyOtp}
        onContextMenu={(e) => {
          e.preventDefault()
          props.onContextMenu()
        }}
      >
        <ListItemText
          sx={{ ml: '15px' }}
          primary={
            <Typography
              component="span"
              sx={{ color: 'text.primary', display: 'block', fontStyle: 'oblique' }}
            >
              {props.totpKey.issuer ? (props.totpKey.issuer + '(' + props.totpKey.label + ')') : props.totpKey.label}
            </Typography>
          }
          secondary={
            <Typography
              component="span"
              sx={{ color: '#1c8e9b', display: 'inline', fontSize: '30px', textAlign: 'center', ml: '5px' }}
            >
              {otpRes.otp}
            </Typography>
          } />
        <ListItemAvatar>
          <CircularProgress color={
            progress > 50 ? 'info' : (progress > 25 ? 'warning' : 'error')
          } variant='determinate' thickness={10} value={progress} />
        </ListItemAvatar>
      </ListItemButton>

    </>
  )
}
