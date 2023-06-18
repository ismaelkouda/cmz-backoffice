import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requete-password',
  templateUrl: './requete-password.component.html',
  styleUrls: ['./requete-password.component.scss']
})
export class RequetePasswordComponent implements OnInit {


  constructor(
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
  }

  handleRequest() {
    this.router.navigateByUrl(`/réinitialisation/confirmation`)

  }
  onCancel() {
    this.location.back()
  }

}
