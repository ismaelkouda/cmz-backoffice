import { SharedState } from './shared/shared.state';
import { SHARED_STATE_NAME } from './shared/shared.selector';
import { SharedReducer } from './shared/shared.reducer';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { AuthState } from './../../presentation/pages/authentication/state/auth.state';
import { AuthReducer } from '../../presentation/pages/authentication/state/auth.reducer';
import { AUTH_STATE_NAME } from '../../presentation/pages/authentication/state/auth.selector';

export interface AppState {
  [SHARED_STATE_NAME]: SharedState;
  [AUTH_STATE_NAME]: AuthState;
  router: RouterReducerState;
}

export const appReducer = {
  [SHARED_STATE_NAME]: SharedReducer,
  [AUTH_STATE_NAME]: AuthReducer,
  router: routerReducer,
};