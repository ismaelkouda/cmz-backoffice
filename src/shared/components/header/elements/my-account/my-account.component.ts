import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EncodingDataService } from "src/shared/services/encoding-data.service";
const Swal = require('sweetalert2');


@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.scss"],
})
export class MyAccountComponent implements OnInit {

  public userName: string;
  public profileImg: "assets/images/dashboard/profile.jpg";
  public currentUser: any;

  constructor(
    public router: Router,
    private storage: EncodingDataService
  ) { }

  ngOnInit() {
    console.log("");
    this.currentUser = JSON.parse(this.storage.getData('user'));
  }

  public logout(): void {
    Swal.fire({
      title: 'En êtes vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.storage.removeData('user');
        this.router.navigateByUrl('auth/login');
      }
    });
  }
}
