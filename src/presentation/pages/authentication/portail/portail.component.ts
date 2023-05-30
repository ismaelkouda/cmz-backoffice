import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PortailData } from './portail-data';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { UserModel } from 'src/domain/models/user.model';
import { LocalStorageService } from 'ngx-webstorage';
const Swal = require('sweetalert2');


@Component({
  selector: 'app-portail',
  templateUrl: './portail.component.html',
  styleUrls: ['./portail.component.scss']
})
export class PortailComponent implements OnInit, AfterViewInit {
  public dateOfDay: string = '';
  public heureOfDay: string = '';
  public listModule: any = [];
  public listItemPortail: PortailData;
  public profil: UserModel;

  constructor(
    private readonly http: HttpClient,
    public router: Router,
    private title: Title,
    private storage: EncodingDataService,
  ) { }

  ngOnInit() {
    this.getDate();
    this.getTime();
    this.profil = JSON.parse(this.storage.getData('user'));
  }

  ngAfterViewInit(): void {
    this.loadDataPortail();
  }

  async loadDataPortail(): Promise<void> {
    this.listItemPortail = await lastValueFrom(this.http.get<PortailData>('assets/portail.json'));
  }

  getDate() {
    const date = new Date;
    const year = date.getFullYear();
    const month = date.getMonth();
    const months = new Array('Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre');
    const d = date.getDate();
    const day = date.getDay();
    const days = new Array('Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi');
    this.dateOfDay = '' + days[day] + ' ' + d + ' ' + months[month] + ' ' + year;
  }

  getTime() {
    const today = new Date();
    const t = today.toLocaleTimeString();
    this.heureOfDay = t;
  }

  identity(item) {
    return item.url;
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
