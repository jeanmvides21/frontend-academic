import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,
  
  // Login
  on(AuthActions.login, (state): AuthState => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(AuthActions.loginSuccess, (state, { user }): AuthState => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),
  
  on(AuthActions.loginFailure, (state, { error }): AuthState => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
    user: null,
  })),
  
  // Logout
  on(AuthActions.logout, (state): AuthState => ({
    ...state,
    loading: true,
  })),
  
  on(AuthActions.logoutSuccess, (): AuthState => ({
    ...initialAuthState,
  })),
  
  // Load User from Storage
  on(AuthActions.loadUserFromStorageSuccess, (state, { user }): AuthState => ({
    ...state,
    user,
    isAuthenticated: true,
  })),
  
  // Clear Error
  on(AuthActions.clearAuthError, (state): AuthState => ({
    ...state,
    error: null,
  }))
);

