import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';
import infinityLogo from '../assets/project-infinity.png';
import algo8Logo from '../assets/algoai.png';
import secondaryLogo from '../assets/dnacoe.png';

const validationSchema = Yup.object({
  sapId: Yup.string()
    .required('SAP ID is required')
    .min(3, 'SAP ID must be at least 3 characters')
});

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate();

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-container">

          {/* Left Section */}
          <div className="login-left">
            <div className="left-content">
              <div className="image-container">
                <img src={infinityLogo} alt="Infinity Logo" className="login-image" />
              </div>
              <div className="title-divider"></div>
              <div className="project-title">Project INFINITI - Digital Plant</div>
              <div className="footer-branding">
                <div className="branding-row">
                  <img src={algo8Logo} alt="Algo8 Logo" className="algo8-logo-image" />
                  <span className="brand-divider">|</span>
                  <span className="brand-text">an algo8.ai product</span>
                </div>
                <img src={secondaryLogo} alt="Partner Logo" className="secondary-logo-image" />
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="vertical-divider"></div>

          {/* Right Section - Form */}
          <div className="login-right">
            <h1 className="signin-title">Sign In</h1>

            <Formik
              initialValues={{ sapId: '' }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, setFieldError }) => {
                try {
                  const response = await axios.post(
                    'http://localhost:4000/api/auth/login',
                    { sapId: values.sapId.trim() },
                    {
                      headers: { 'Content-Type': 'application/json' }
                    }
                  );

                  // ✅ Only proceed if backend confirms success
                  if (response.data?.success && response.data?.user) {
                    const user = response.data.user;

                    // optional persistence
                    localStorage.setItem('user', JSON.stringify(user));

                    // update app state
                    onLogin(user);

                    // redirect ONLY after authentication success
                    navigate('/home');
                  } else {
                    setFieldError(
                      'sapId',
                      response.data?.message || 'Authentication failed.'
                    );
                  }

                } catch (err) {
                  const msg = err.response?.data?.message || 'Login failed. Please try again.';
                  setFieldError('sapId', msg);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({
                values, errors, touched,
                handleChange, handleBlur, handleSubmit, isSubmitting
              }) => (
                <form onSubmit={handleSubmit} className="login-form">
                  <div className="form-field">
                    <label htmlFor="sapId" className="field-label">SAP ID</label>
                    <input
                      id="sapId"
                      type="text"
                      name="sapId"
                      className={`sap-input ${touched.sapId && errors.sapId ? 'error' : ''}`}
                      placeholder="Enter your SAP ID"
                      value={values.sapId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isSubmitting}
                      autoComplete="off"
                    />
                    {touched.sapId && errors.sapId && (
                      <span className="error-text">{errors.sapId}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="signin-button"
                  >
                    {isSubmitting ? (
                      <span className="btn-loading">
                        <span className="spinner"></span>
                        Signing in...
                      </span>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>
                </form>
              )}
            </Formik>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginForm;