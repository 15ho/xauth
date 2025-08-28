import { alpha, Button, Dialog, DialogActions, styled, TextField, Typography } from "@mui/material"
import { useRef, useState } from "react"

export default function ConfirmDialog(props: { confirmMsg: string, onClick: (confirm: boolean, password: string) => void }) {
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null);


  const BlurredDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-container': {
      backdropFilter: 'blur(4px)',
      backgroundColor: alpha(theme.palette.common.white, 0.5),
    },
    '& .MuiDialog-paper': {
      borderRadius: theme.spacing(2),
      boxShadow: theme.shadows[24],
    },
    textAlign: 'center',
  }))

  const handleCancel = () => {
    props.onClick(false, '')
  }

  const handleConfirm = () => {
    setError('')
    const passwd = inputRef.current?.value || undefined
    if (!passwd) {
      setError('Password is required')
      return
    }
    try {
      props.onClick(true, passwd)
    } catch (error) {
      setError('' + error)
    }
  }

  return (
    <BlurredDialog
      open={true}
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
      <Typography variant="h6">
        {props.confirmMsg}
      </Typography>

      <TextField
        label="Enter your password"
        variant="outlined"
        type="password"
        sx={{ width: '90%', m: '0 auto' }}
        inputRef={inputRef}
        error={!!error}
        helperText={error}
        required
      />

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button size="small" variant="contained" onClick={handleCancel}>
          Cancel
        </Button>
        <Button size="small" onClick={handleConfirm} sx={{ color: '#7f0b13f2' }}>
          Confirm
        </Button>
      </DialogActions>


    </BlurredDialog >
  )
}
