import React, { useRef, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogActions,
  TextField,
  Button,
  styled,

  Container,
  Paper,
  Typography,
  Box
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import jsQR from 'jsqr'
import KeySharpIcon from '@mui/icons-material/KeySharp'
import { checkTotpKey, parseTotpKeyUri, TOTPKey } from './common'

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
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
}))

const UploadArea = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  fontSize: '10px',
  marginTop: theme.spacing(1),
}))

export default function TOTPForm(props: { onClose: () => void, onSubmit: (totpKey: TOTPKey) => void }) {

  const [formData, setFormData] = useState<TOTPKey>()
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('') // reset
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    const url = URL.createObjectURL(file)

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')

      if (ctx) {
        ctx.drawImage(img, 0, 0, img.width, img.height)
        const imageData = ctx.getImageData(0, 0, img.width, img.height)

        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          const totpKey = parseTotpKeyUri(code.data)
          if (totpKey && checkTotpKey(totpKey)) {
            setFormData(totpKey)
          } else {
            setError('Invalid TOTP key')
          }
        } else {
          setError('Invalid QR code')
        }
      }

      URL.revokeObjectURL(url)
    }

    img.onerror = () => {
      setError('Loading image failed')
    }

    img.src = url
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (formData) {
      try {
        props.onSubmit(formData)
      } catch (error) {
        setError('Import key failed:' + error)
        return
      }
      props.onClose()
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    setError('')
    setFormData(undefined)
  }

  return (
    <>
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
        <DialogTitle>
        </DialogTitle>

        <Container maxWidth="sm">
          {!formData && (
            <StyledPaper>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />

              <UploadArea onClick={handleUploadClick}>
                <KeySharpIcon fontSize="large" color='primary' />
                <Typography variant="h6" gutterBottom>
                  Click or drop an image in this area
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Your 2FA QR code image will be automatically detected and parsed
                </Typography>
              </UploadArea>
              {error && (
                <Typography variant="body2" color="error" sx={{ my: 2 }}>
                  {error}
                </Typography>
              )}
            </StyledPaper>
          )}
        </Container>

        <form onSubmit={handleSubmit}>
          {formData && (
            <StyledPaper sx={{ padding: '1px' }}>
              {
                (["issuer", "label", "algorithm", "digits", "period"] as (keyof TOTPKey)[]).map((field) => (
                  <StyledTextField
                    label={field.toUpperCase()}
                    value={formData[field]}
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                    variant='filled'
                    focused
                    color='success'
                  />
                ))
              }
              {error && (
                <Typography variant="body2" color="error" sx={{ my: 2 }}>
                  {error}
                </Typography>
              )}
              <Button style={{ color: '#7f0b13f2' }} onClick={handleRemove}>remove</Button>
            </StyledPaper>
          )}

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={props.onClose}>cancel</Button>
            <Button type="submit" variant="contained" disabled={!formData || error !== ''}>
              Submit
            </Button>
          </DialogActions>
        </form>
      </BlurredDialog>
    </>
  )
}