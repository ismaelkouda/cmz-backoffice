import { EncodingDataService } from './../../../../shared/services/encoding-data.service';
import { UserLoginUseCase } from '../../../../domain/usecases/users/user-login.usecase';
import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

// @ts-ignore
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  public show: boolean = false
  public siteKey: string;
  public currentRecaptcha: string;
  constructor(
    private fb: FormBuilder,
    private readonly userLoginUseCase: UserLoginUseCase,
    private router: Router,
    private toastService: ToastrService,
    private storage: EncodingDataService,
  ) {

  }

  ngOnInit() {
    this.siteKey = environment.recaptcha.siteKey;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });

  }

  onLogin() {
    // if (!this.currentRecaptcha) {
    //   this.toastService.warning('Etes vous un robot ?');
    //   return;
    // }
    this.userLoginUseCase.execute(this.loginForm.value).subscribe({
      next: (response) => {
        this.storage.saveData('user', JSON.stringify(response.data));
        if (response['data']?.profil?.slug === 'utilisateur') {
          this.router.navigateByUrl(`/dashboard`)
        } else {
          this.router.navigateByUrl(`/auth/portail`).then(
            () => {
              localStorage.setItem('layout', 'Paris');
            });
        }
        this.toastService.success(`Bienvenue ${response.data.nom} ${response.data.prenoms}`);
      },
      error: (error) => {
        this.toastService.error(error.message);
      }
    })
  }
  showPassword() {
    this.show = !this.show
  }

  handleExpire() {

  }
}
