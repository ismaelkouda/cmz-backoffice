import { AuthenticationService } from './../../data-access/authentication.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { REINITIALISATION } from 'src/presentation/app-routing.module';
import { RESET_PASSWORD } from '../../password-reset-routing.module';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  isModal: boolean = false;
  selectedEmail: string
  constructor(
    private location: Location,
    private authenticationService: AuthenticationService,
    private toastService: ToastrService,
  ) { }

  ngOnInit() {}

  public HandleForgotPassword() {
    this.authenticationService
      .HandleForgotPassword({
        email: this.selectedEmail
      })
      .subscribe({
        next: (response) => {  
          this.isModal = true 
          this.toastService.success(response.message);         
        },
        error: (error) => {
          this.toastService.error(error.error.message);
        }
      })
  }
  handleOpen(){
    this.isModal = false
  } 
  onCancel() {
    this.location.back()
  }

  
}
