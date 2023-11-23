import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../data-access/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public passwordForm: FormGroup;
  public newPasswordValue: string;
  public confirmPasswordValue: string;
  public queryValue: any

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log("data",params);
      
      this.queryValue = params
    });
    this.initFormPassword()
    this.OnChangeNewPasswordvalue()
    this.OnChangeConfirmPasswordvalue()
  }

  public initFormPassword(): void {
    this.passwordForm = this.fb.group({
      password: ['',[Validators.required]],
      confirm_password: ['',[Validators.required]],
    });
  }

  OnChangeNewPasswordvalue() {
    return this.passwordForm
      .get('password')
      .valueChanges.subscribe((value) => {        
        return this.newPasswordValue = value;
      });
  }
  OnChangeConfirmPasswordvalue() {
    return this.passwordForm
      .get('confirm_password')
      .valueChanges.subscribe((value) => { 
        return this.confirmPasswordValue = value;
      });
  }
  public HandleResetPassword() {
    this.authenticationService
      .HandleResetPassword({
        ...this.passwordForm.value,...this.queryValue
      })
      .subscribe({
        next: (response) => {  
          this.router.navigateByUrl('auth/login')        
          this.toastrService.success(response.data.message); 
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  onCancel() {
    this.passwordForm.reset()
    this.router.navigateByUrl('/auth/login')
  }

  handleConfirm() { }
}
