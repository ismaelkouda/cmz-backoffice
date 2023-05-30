//import { UserLoginUseCase } from 'src/domain/usecases/user-login.usecase';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import {
  loginStart,
  loginSuccess,
} from './auth.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { AppState } from '../../../../core/store/app.state';
import {
  setLoadingSpinner,
  setErrorMessage,
} from '../../../../core/store/shared/shared.actions';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  userData: any;
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    //private userService: UserLoginUseCase,
    private toastrService: ToastrService,
    private router: Router

  ) { }

  // login$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(loginStart),
  //     exhaustMap((payload) => {
  //       return this.userService.execute({ email: payload.email, password: payload.password }).pipe(
  //         map((res) => {
  //           this.store.dispatch(setLoadingSpinner({ status: false }));
  //           localStorage.setItem('user', JSON.stringify(res.data));
  //           return loginSuccess({ res, redirect: this.router.navigateByUrl(`/auth/portail`) });
  //         }),
  //         catchError((error) => {
  //           this.store.dispatch(setLoadingSpinner({ status: false }));
  //           return of(setErrorMessage(this.toastrService.error(error.error.message)));
  //         })
  //       );
  //     })
  //   );
  // });

}


