import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { LoadingBarService } from '@ngx-loading-bar/core';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-usage-metier',
  templateUrl: './usage-metier.component.html',
  styleUrls: ['./usage-metier.component.scss']
})
export class UsageMetierComponent implements OnInit {

  public module: string;
  public subModule: string;
  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentObject: any;
  public listUsages: Array<any> = [];
  public listTenants: Array<any> = [];
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public selectedUsage: string;
  public selectedTenant: any

  constructor(
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private clipboardApi: ClipboardService,
    private loadingBar: LoadingBarService,

  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[2];
    });
    this.GetAllUsageMetier()
    this.isFilter()
  }

  public GetAllUsageMetier() {
    // this.portefeuilleTenantService
    //   .GetAllUsageMetier({}, this.p)
    //   .subscribe({
    //     next: (response) => {
    //       this.listUsages = response.data.data;
    //       this.totalPage = response.data.last_page;
    //       this.totalRecords = response.data.total;
    //       this.recordsPerPage = response.data.per_page;
    //       this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
    //     },
    //     error: (error) => {
    //       this.toastrService.error(error.message);
    //     }
    //   })
  }
  public onFilter(): void {
    const data = {
      nom_usage: this.selectedUsage,
      tenant_code: this.selectedTenant?.code
    };
    // this.portefeuilleTenantService
    //   .GetAllUsageMetier(data, this.p)
    //   .subscribe({
    //     next: (response) => {
    //       this.listUsages = response['data']['data'];
    //       this.totalPage = response['data'].last_page;
    //       this.totalRecords = response['data'].total;
    //       this.recordsPerPage = response['data'].per_page;
    //       this.offset = (response['data'].current_page - 1) * this.recordsPerPage + 1;
    //       this.listUsages.length === 0 ?
    //         Swal.fire('P;ATRIMOINE SIM', 'Aucune donnée pour cet Tenant', 'error')
    //         : ''
    //     },
    //     error: (error) => {
    //       this.toastrService.error(error.error.message);
    //     }
    //   });
  }


  OnRefresh() {
    this.selectedTenant = null
    this.selectedUsage = null
  }
  onPageChange(event) {

  }

  public copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }

  public onInitForm(): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = undefined;
  }
  public onEditForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = data;
  }
  public onShowForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = { ...data, show: true };
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }
  public pushListDatas(event: any): void {
    this.listUsages = event;
  }
  public handleActivate(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous Activer l'usage <br> ${data.nom_tenant} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        // this.portefeuilleTenantService
        //   .OnChangeStatutUsage({
        //     usage_id: data.id,
        //     statut: 'actif'
        //   })
        //   .subscribe({
        //     next: (response) => {
        //       this.GetAllUsageMetier();
        //       this.toastrService.success(response.message);
        //     },
        //     error: (error) => {
        //       this.toastrService.error(error.error.message);
        //     }
        //   })
      }
    });
  }
  public handleDisable(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous Désactiver l'usage <br> ${data.nom_tenant} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        // this.portefeuilleTenantService
        //   .OnChangeStatutUsage({
        //     usage_id: data.id,
        //     statut: 'inactif'
        //   }).subscribe({
        //     next: (response) => {
        //       this.GetAllUsageMetier();
        //       this.toastrService.success(response.message);
        //     },
        //     error: (error) => {
        //       this.toastrService.error(error.error.message);
        //     }
        //   })
      }
    });
  }

  public isFilter(): boolean {
    return (!this.selectedTenant && !this.selectedUsage) ? true : false
  }

}

