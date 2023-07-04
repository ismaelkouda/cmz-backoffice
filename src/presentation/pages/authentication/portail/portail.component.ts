import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
const Swal = require('sweetalert2');

// @ts-ignore
import { menuJson } from 'src/assets/menu';



@Component({
  selector: 'app-portail',
  templateUrl: './portail.component.html',
  styleUrls: ['./portail.component.scss']
})
export class PortailComponent implements OnInit, AfterViewInit {
  public dateOfDay: string = '';
  public heureOfDay: string = '';
  public listModule: any;
  public profil: any;
  public permissionsJson: any = [];
  public portailJson: any = [];
  public listPermissionMapper: any;

  constructor(
    public router: Router,
    private storage: EncodingDataService,
  ) {
    this.permissionsJson = menuJson;
  }

  ngOnInit() {
    this.getDate();
    this.getTime();
    this.profil = JSON.parse(this.storage.getData('user'));
    // Vérification des permission
    this.permissionsJson.map(module => {
      if (module?.children) {
        module?.children.map(sous_module => {
          if (module.data === "1-0-0-patrimoine" && this.profil.permissions.includes(sous_module.data)) {
            this.permissionsJson[1] = { ...module, statut: true }
          }
          if (module.data === "2-0-0-referentiel-telemetrie" && this.profil.permissions.includes(sous_module.data)) {
            this.permissionsJson[2] = { ...module, statut: true }
          }
          if (module.data === "3-0-0-gestion-portefeuille" && this.profil.permissions.includes(sous_module.data)) {
            this.permissionsJson[3] = { ...module, statut: true }
          }
          if (module.data === "4-0-0-suivi-operations" && this.profil.permissions.includes(sous_module.data)) {
            this.permissionsJson[4] = { ...module, statut: true }
          }
          if (module.data === "5-0-0-supervision-sim" && this.profil.permissions.includes(sous_module.data)) {
            this.permissionsJson[5] = { ...module, statut: true }
          }
          if (module.data === "6-0-0-parametres-securite" && this.profil.permissions.includes(sous_module.data)) {
            this.permissionsJson[6] = { ...module, statut: true }
          }
        })
      }
    })
    this.portailJson = this.permissionsJson.slice(1);
    this.storage.saveData("current_menu", JSON.stringify(this.permissionsJson))
  }

  ngAfterViewInit(): void {
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
