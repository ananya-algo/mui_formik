import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import infinityLogo from '../assets/project-infinity.png';
import algo8Logo from '../assets/algoai.png';
import secondaryLogo from '../assets/dnacoe.png';

const validationSchema = Yup.object({
  sapId: Yup.string().required('SAP ID is required')
});

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate();

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-container">
          {/* Left Section - Illustration (70%) */}
          <div className="login-left">
            <div className="left-content">
              <div className="image-container">
                <img 
                  src={infinityLogo} 
                  alt="Infinity Logo" 
                  className="login-image"
                />
              </div>
              
              {/* Horizontal divider above project title */}
              <div className="title-divider"></div>
              
              <div className="project-title">
                Project INFINITI - Digital Plant
              </div>
              
              <div className="footer-branding">
                <div className="branding-row">
                  <img 
                    src={algo8Logo} 
                    alt="Algo8 Logo" 
                    className="algo8-logo-image"
                  />
                  <span className="brand-divider">|</span>
                  <span className="brand-text">an algo8.ai product</span>
                </div>
                <img 
                  src={secondaryLogo} 
                  alt="Partner Logo" 
                  className="secondary-logo-image"
                />
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="vertical-divider"></div>

          {/* Right Section - Form (30%) */}
          <div className="login-right">
            <h1 className="signin-title">Sign In</h1>
            
            <Formik
              initialValues={{ sapId: '' }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
             
                onLogin(values);
                
              
                navigate('/home');
                
                setSubmitting(false);
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
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
                    <span>Sign In</span>
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