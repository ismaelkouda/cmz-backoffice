
import { createAction, props } from '@ngrx/store';
import { UserModel } from 'src/domain/models/user.model';
export const LOGIN_START = '[auth page] login start';
export const LOGIN_SUCCESS = '[auth page] login Success';
export const LOGIN_FAIL = '[auth page] login Fail';


export const loginStart = createAction(
  LOGIN_START,
  props<any>()
);
export const loginSuccess = createAction(
  LOGIN_SUCCESS,
  props<{ res: any; redirect: any }>()
);

export const dummyAction = createAction('[dummy action]');