import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PortailData } from './portail-data';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
//import { writeJsonFile } from 'write-json-file';
const Swal = require('sweetalert2');

// @ts-ignore
import menuJson from '../../../../assets/menu.json';

// @ts-ignore
import portailJson from '../../../../assets/portail.json';



@Component({
  selector: 'app-portail',
  templateUrl: './portail.component.html',
  styleUrls: ['./portail.component.scss']
})
export class PortailComponent implements OnInit, AfterViewInit {
  public dateOfDay: string = '';
  public heureOfDay: string = '';
  public listModule: any;
  public listItemPortail: PortailData;
  public profil: any;
  public permissionsJson: any = [];
  public portailJsonDats: any;
  //List Check Menu As Permissions


  //List Permissions
  public permissionsPatrimoines: string = 'patrimoine/cartes-sim-actives';

  constructor(
    private readonly http: HttpClient,
    public router: Router,
    private storage: EncodingDataService,
  ) {
    this.permissionsJson = menuJson;
    this.portailJsonDats = portailJson;
  }

  ngOnInit() {
    this.getDate();
    this.getTime();
    this.profil = JSON.parse(this.storage.getData('user'));
    // Vérification des permission
    this.permissionsJson.map(module => {
      if (module.children) {
        module.children.map(sous_module => {
          if (module.data === "1-0-0-patrimoine" && this.profil.permissions.includes(sous_module.data)) {
            portailJson[0].statut;
          }
        })
      }
    })

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
