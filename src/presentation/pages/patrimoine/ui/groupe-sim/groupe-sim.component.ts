import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TelemetrieService } from 'src/presentation/pages/ref-telemetrie/data-access/telemetrie.service';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { ClipboardService } from 'ngx-clipboard';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-groupe-sim',
  templateUrl: './groupe-sim.component.html',
  styleUrls: ['./groupe-sim.component.scss']
})
export class GroupeSimComponent implements OnInit {

  public module: string;
  public subModule: string;
  public initialView: boolean = true;
  public formsView: boolean = false;
  public affectationView: boolean = false;
  public visualisationView: boolean = false;
  public currentObject: any;
  public listProfils: any[] = [];
  public selectedNom: string;
  public selectedImsi: string;
  public selectedMsisdn: string;


  constructor(
    private telemetrieService: TelemetrieService,
    private patrimoineService: PatrimoineService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private clipboardApi: ClipboardService,

  ) { }

  ngOnInit() {
    this.GetAllGroupes();
    this.isFilter();
    this.route.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[1];
    });
  }

  public GetAllGroupes(): void {
    this.patrimoineService
      .GetAllGroupes({})
      .subscribe({
        next: (response) => {
          this.listProfils = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public OnRefresh(){
    this.GetAllGroupes();
    this.selectedNom = null
    this.selectedImsi = null
    this.selectedMsisdn = null

  }

  public onInitForm(): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = undefined;
  }
  public copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
  public onEditForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = { ...data, type: 'edit' };
  }
  public onShowForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = { ...data, type: 'show' };
  }
  OnAffectaion(data) {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = { ...data, type: 'affectation' };
  }
  OnVisualisation(data) {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = { ...data, type: 'visualiser' };
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }
  public pushListProfils(event: any): void {
    this.listProfils = event;
  }
  public handleActivateProfil(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous Activer le profil <br> ${data.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.patrimoineService
          .handleActivateGroupe(data.id)
          .subscribe({
            next: (response) => {
              this.toastrService.success(response.message);
              this.GetAllGroupes();
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }
  public handleDisableProfil(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous Désactiver le profil <br> ${data.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.patrimoineService
          .handleDisableGroupe(data.id)
          .subscribe({
            next: (response) => {
              this.toastrService.success(response.message);
              this.GetAllGroupes();
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }

  public HandleDeleteGroupe(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous Supprimer le groupe <br> ${data.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.patrimoineService
          .HandleDeleteGroupe(data.id)
          .subscribe({
            next: (response) => {
              this.toastrService.success(response.message);
              this.GetAllGroupes();
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }

  onFilter() {
    this.patrimoineService
      .GetAllGroupes({
        nom: this.selectedNom,
        imsi: this.selectedImsi,
        msisdn: this.selectedMsisdn
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
  public isFilter(): boolean {
    return (!this.selectedNom && !this.selectedImsi && !this.selectedMsisdn) ? true : false
  }
}
