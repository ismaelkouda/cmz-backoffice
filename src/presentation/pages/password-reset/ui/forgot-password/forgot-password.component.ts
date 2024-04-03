import { AuthenticationService } from './../../data-access/authentication.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  isModal: boolean = false;
  selectedEmail: string;
  public title = 'Mot de passe oublié - Système de Gestion de Collecte Centralisée';
  constructor(
    private location: Location,
    private authenticationService: AuthenticationService,
    private toastService: ToastrService,
    private titleService: Title
  ) {
    this.titleService.setTitle(`${this.title}`);
  }

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
