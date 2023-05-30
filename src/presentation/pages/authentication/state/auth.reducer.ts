import { loginSuccess } from './auth.actions';
import { createReducer, on } from '@ngrx/store';
import { initialState } from './auth.state';

const _authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, action) => {
    return {
      ...state,
      data: action.res,
    };
  }),
);

export function AuthReducer(state, action) {
  return _authReducer(state, action);
}