import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  toggleAuthMode,
  setEmail,
  setPassword,
  setErrorMessage,
  copyTokenSuccess,
  authenticateUser,
  disableUiAndCloseWindow
} from './store/authSlice';
import './App.css';

export default function App() {
  const dispatch = useDispatch();
  const {
    isLoginMode,
    email,
    password,
    accessToken,
    errorMessage,
    successMessage,
    loading,
    isInactive,
    windowClosedStatus
  } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isInactive) return;

    if (!email || !password) {
      dispatch(setErrorMessage("Please fill in all fields."));
      return;
    }

    dispatch(authenticateUser({ email, password, isLoginMode }));
  };

  const handleCopyToken = () => {
    if (accessToken) {
      navigator.clipboard.writeText(accessToken);
      dispatch(copyTokenSuccess());
    }
  };

  const handleCloseManual = () => {
    dispatch(disableUiAndCloseWindow());
  };

  return (
    <div className="card">
      <h2>{isLoginMode ? 'Login' : 'Register'}</h2>

      {!accessToken ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => dispatch(setEmail(e.target.value))}
              disabled={isInactive || loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => dispatch(setPassword(e.target.value))}
              disabled={isInactive || loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isInactive || loading}
          >
            {loading ? 'Processing...' : isLoginMode ? 'Login' : 'Register'}
          </button>

          {errorMessage && <div className="alert">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <div className="toggle-link">
            <span>{isLoginMode ? 'Need an account?' : 'Already have an account?'} </span>
            <a
              onClick={() => !isInactive && dispatch(toggleAuthMode())}
              className={isInactive ? 'disabled' : ''}
            >
              {isLoginMode ? 'Register' : 'Login'}
            </a>
          </div>
        </form>
      ) : (
        <div>
          <p style={{ color: '#22c55e', marginTop: 0 }}>Authentication Successful!</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
            Copy this Access Token and paste it into your clipBQ Cloud Desktop application:
          </p>

          <div className="token-box">
            {accessToken}
          </div>

          {/* Buttons rendered inactive after copying token */}
          <button
            onClick={handleCopyToken}
            disabled={isInactive}
            style={{ marginTop: '1rem' }}
          >
            Copy Token
          </button>

          <button
            onClick={handleCloseManual}
            disabled={isInactive}
            style={{ marginTop: '0.5rem', backgroundColor: '#dc2626' }}
          >
            Close Window
          </button>

          {successMessage && <div className="success-message">{successMessage}</div>}

          {windowClosedStatus && (
            <p style={{ fontSize: '0.75rem', color: '#ef4444', textAlign: 'center', marginTop: '1rem' }}>
              Browser block policy prevented automatic window closure. You may close this tab manually.
            </p>
          )}
        </div>
      )}
    </div>
  );
}