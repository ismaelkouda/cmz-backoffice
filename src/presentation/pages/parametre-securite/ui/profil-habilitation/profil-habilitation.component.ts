import { ToastrService } from 'ngx-toastr';
import { ParametreSecuriteService } from './../../data-access/parametre-securite.service';
import { Component, OnInit } from '@angular/core';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-profil-habilitation',
  templateUrl: './profil-habilitation.component.html',
  styleUrls: ['./profil-habilitation.component.scss']
})
export class ProfilHabilitationComponent implements OnInit {

  public listProfils: Array<any> = [];
  public listUsers: Array<any> = [];
  public selectedProfil: any;
  public currentObject: any;
  public selectedUSer: any;
  public initialView: boolean = true;
  public formsView: boolean = false;
  public affectationView: boolean = false;
  public visualisationView: boolean = false;

  constructor(
    private parametreSecuriteService: ParametreSecuriteService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.GetAllProfilHabilitations();
    this.isFilter()
  }
  public GetAllProfilHabilitations() {
    this.parametreSecuriteService
      .GetAllProfilHabilitations({})
      .subscribe({
        next: (response) => {
          this.listProfils = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  onFilter() {
    this.parametreSecuriteService
      .GetAllProfilHabilitations({
        nom: this.selectedProfil
      })
      .subscribe({
        next: (response) => {
          this.listProfils = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  onInitForm() {
    this.initialView = false;
    this.formsView = true;
  }
  public onViewAffection(data: any): void {
    this.initialView = false;
    this.affectationView = true;
    this.currentObject = data;
  }
  public onEditForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = data;
  }
  public onViewVisualisation(data: any): void {
    this.initialView = false;
    this.visualisationView = true;
    this.currentObject = data;
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }
  public pushAffectationView(event: boolean): void {
    this.affectationView = event;
    this.initialView = !event;
  }
  public pushVisualisationView(event: boolean): void {
    this.visualisationView = event;
    this.initialView = !event;
  }
  public pushListProfils(event: any): void {
    this.listProfils = event;
  }
  public handleleteProfilHabilitation(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous supprimer le profil ${data.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.parametreSecuriteService
          .handleleteProfilHabilitation({}, data.id)
          .subscribe({
            next: (response) => {
              this.GetAllProfilHabilitations();
              this.toastrService.success(response.message);
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }

  public isFilter(): boolean {
    return !this.selectedProfil ? true : false
  }

}
