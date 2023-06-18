import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss']
})
export class ConfirmPasswordComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {

  }

  onCancel() {
    this.router.navigateByUrl('/auth/login')
  }

  handleConfirm() { }

}
