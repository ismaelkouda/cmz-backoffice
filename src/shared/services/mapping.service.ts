import { ApplicationType } from './../enum/ApplicationType.enum';
import { EncodingDataService } from './encoding-data.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StoreLocaleService } from './store-locale.service';
import { HttpClient } from '@angular/common/http';
import { EndPointUrl } from '../enum/api.enum';
import { OperationTransaction } from '../enum/OperationTransaction.enum';

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  public currentUser: any
  public currentPermissions: any[]
  public listOperations: any[]
  public listObjectifSla: any[]
  public listOperationTraitementVue: any[]
  public structureGlobale: any;
  public logoTenant: any;
  public tenant: any;
  public grafanaLink: string;
  public rejetLink: string;
  public approLink: string;
  public typeNiveau: string;
  public baseUrl: string;
  public fileUrl: string;
  public minioUrl: string;
  public noderedUrl: string
  public localCalendar: any;
  public applicationType: string;
  public suffixEmail: string;
  public appName: string;
  public sourceStockTenantSim: string;
  public sourceStockOrangeSim: string;
  public sourceSoldeDotation: string;
  public sourceSoldeDotationOrange: string;
  public _tenantDataSource: BehaviorSubject<any> = new BehaviorSubject(null);
  public tenantData$ = this._tenantDataSource.asObservable();
  public _volumeDataGlobalSource: BehaviorSubject<string> = new BehaviorSubject('');
  public volumeDataGlobal$ = this._volumeDataGlobalSource.asObservable();
  public _ligneCreditSource: BehaviorSubject<string> = new BehaviorSubject('');
  public ligneCreditGlobal$ = this._ligneCreditSource.asObservable();
  public dashbordTransactionSLa: string;
  public notifications: number

  constructor(
    private storage: EncodingDataService,
    private storeLocaleService: StoreLocaleService,
    private http: HttpClient

  ) {
    this.sourceStockTenantSim = 'Le système utilisera une SIM blanche du Stock du Tenant';
    this.sourceStockOrangeSim = "Orange fournira la SIM. A l'issue de l'operation, elle sera livrée au point de contact accompagnée d'une facture";
    this.sourceSoldeDotation = 'Le solde de la dotation Data sera debité du volume demandé'
    this.sourceSoldeDotationOrange = "Orange fera le dépôt du volume demandé sur le compte Data de la SIM. A l'issue de l'operation une facture sera générée";
    this.storeLocaleService.tenantData$.subscribe((res: any) => {
      this.currentUser = res ?? JSON.parse(this.storage.getData('user') || null);
      this.baseUrl = `${this.currentUser?.tenant?.url_backend}/api/v1/`
      this.fileUrl = `${this.currentUser?.tenant?.url_minio}/`
      this.minioUrl = `${this.currentUser?.tenant?.url_minio}/`
      this.noderedUrl = this.currentUser?.tenant?.url_nodered.replace("https://", "")      
      this.tenant = this.currentUser?.tenant;      
      this.structureGlobale = this.currentUser?.structure_organisationnelle;
      this.logoTenant = `${this.fileUrl}${this.tenant?.logo_tenant}`;
      this.grafanaLink = this.tenant?.lien_dashboard_grafana;
      this.approLink = this.tenant?.lien_dashboard_appro;
      this.rejetLink = this.tenant?.lien_dashboard_rejets;
      this.dashbordTransactionSLa = 'https://osim-dashboard.orange.ci:50200/d/fUHASnXVs/tb-des-demandes?orgId=1&refresh=10m'
      const newDatatEnv = { ...this.currentUser?.env, typeNiveau: 'Type Emplacement' };
      this.typeNiveau = newDatatEnv?.typeNiveau;
      this.applicationType = this.tenant?.application;
      this.suffixEmail = this.tenant?.suffixe_email;
      this.notifications = this.currentUser?.notifications;
      if (this.applicationType === ApplicationType.PATRIMOINESIM) {
        this.appName = 'PATRIMOINE SIM'
        this.listOperations = Object.values(OperationTransaction).filter(item => item !== OperationTransaction.ACHAT_SERVICE && item !== OperationTransaction.PROVISIONNING);
        Object.values(OperationTransaction).forEach(item => {
          this.listOperationTraitementVue.push(item);
        });
      } else if (this.applicationType === ApplicationType.MONITORING) {
        this.appName = 'SIM MONITORING'
        this.listOperations = Object.values(OperationTransaction).filter(item => 
          item !== OperationTransaction.ACHAT_SERVICE && 
          item !== OperationTransaction.PROVISIONNING &&
          item !== OperationTransaction.SWAP && 
          item !== OperationTransaction.VOLUME_DATA
          );
          this.listOperationTraitementVue = Object.values(OperationTransaction).filter(item => 
            item !== OperationTransaction.ACHAT_SERVICE && 
            item !== OperationTransaction.PROVISIONNING &&
            item !== OperationTransaction.SWAP && 
            item !== OperationTransaction.VOLUME_DATA
            );
      }
      if (this.currentUser !== null) {
        this.GetAllPortefeuilleSecond(this.baseUrl)
      }
    });
    this.storeLocaleService._permissions$.subscribe((res: any) => {
      this.currentPermissions = res ?? JSON.parse(this.storage.getData('current_menu') || null);
    });
    if (storage.getData('user')) {
      this.GetAllPortefeuille();
    }
  }

  public GetAllPortefeuille() {
    const url: string = (<string>EndPointUrl.GET_ALL_PORTEFEUILLE);
    this.http.get(`${this.baseUrl}${url}`)
      .subscribe({
        next: (res) => {
          this._volumeDataGlobalSource.next(res['data']?.filter((item: any) => { return item.type === 'volume-data' })[0].solde);
          this._ligneCreditSource.next(res['data']?.filter((item: any) => { return item.type === 'ligne-credit' })[0].solde);
        },
        error: (err) => {
        }
      });
  }
  public GetAllPortefeuilleSecond(uri: string) {
    const url: string = (<string>EndPointUrl.GET_ALL_PORTEFEUILLE);
    this.http.get(`${uri}${url}`)
      .subscribe({
        next: (res) => {
          this._volumeDataGlobalSource.next(res['data']?.filter((item: any) => { return item.type === 'volume-data' })[0].solde);
          this._ligneCreditSource.next(res['data']?.filter((item: any) => { return item.type === 'ligne-credit' })[0].solde);
        },
        error: (err) => {
        }
      });
  }

  statutContrat(statut: string): any {
    switch (statut) {
      case 'actif': {
        return { 'badge-success': true };
      }
      case 'suspendu': {
        return { 'badge-danger': true };
      }
      default:
        return { 'badge-secondary': true };
    }
  }
}
