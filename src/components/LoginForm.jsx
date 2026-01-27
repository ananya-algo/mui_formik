import React, { useState } from 'react'
import { Card, Grid, TextField, Button, Typography, IconButton, InputAdornment, Box } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import './LoginForm.css'

const validationSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
})

const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="login-wrapper">
      <Card className="login-card">
        <Grid container className="login-grid">
    
          <Grid item xs={12} md={6} className="login-right">
            <Typography variant="h4" className="signin-title">
              Sign In
            </Typography>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                onLogin(values)
                navigate('/home')
                setSubmitting(false)
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit} className="login-form">
                  <TextField
                    fullWidth
                    margin="normal"
                    name="email"
                    label="Email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <div className="forgot-row">
                    <Typography variant="body2" className="forgot-password">
                      Forgot Password?
                    </Typography>
                  </div>
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    className="signin-button"
                  >
                    Sign In
                  </Button>
                </form>
              )}
            </Formik>
          </Grid>

      
          <Grid item xs={12} md={6} className="login-left">
            <div className="left-content">
              <div className="image-container">
                <img
                  src="https://picsum.photos/500"
                  alt="Login illustration"
                  className="login-image"
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </Card>
    </div>
  )
}

export default Login