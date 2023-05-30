import { EncodingDataService } from './../../../../shared/services/encoding-data.service';
import { UserLoginUseCase } from '../../../../domain/usecases/users/user-login.usecase';
import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/store/app.state';
import { setLoadingSpinner } from '../../../../core/store/shared/shared.actions';
import { loginStart } from '../state/auth.actions';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  public show: boolean = false

  constructor(
    private fb: FormBuilder,
    //private store: Store<AppState>,
    private readonly userLoginUseCase: UserLoginUseCase,
    private router: Router,
    private toastrService: ToastrService,
    private storage: EncodingDataService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    this.userLoginUseCase.execute(this.loginForm.value).subscribe({
      next: (response) => {
        this.storage.saveData('user', JSON.stringify(response.data));
        this.router.navigateByUrl(`/auth/portail`).then(
          () => {
            localStorage.setItem('layout', 'Paris');
          }
        );
        this.toastrService.success(`Bienvenue ${response.data.nom} ${response.data.prenoms}`);
      },
      error: (error) => {
        this.toastrService.error(error.message);
      }
    })
  }

  showPassword() {
    this.show = !this.show
  }
}
