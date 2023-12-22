import { ApplicationType } from './../enum/ApplicationType.enum';
import { ProvisionningService } from './../../presentation/pages/provisionning/data-access/provisionning.service';
import { EncodingDataService } from './encoding-data.service';
import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MappingService {

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
  public localCalendar: any;
  public applicationType: string;
  public appName: string;
  public sourceStockTenantSim: string;
  public sourceStockOrangeSim: string;
  public sourceSoldeDotation: string;
  public _volumeDataGlobalSource: BehaviorSubject<string> = new BehaviorSubject('');
  public volumeDataGlobal$ = this._volumeDataGlobalSource.asObservable();
  public _ligneCreditSource: BehaviorSubject<string> = new BehaviorSubject('');
  public ligneCreditGlobal$ = this._ligneCreditSource.asObservable();

  constructor(
    private storage: EncodingDataService,
    private provisionningService: ProvisionningService
  ) {
    this.GetAllPortefeuille();
    const data = JSON.parse(this.storage.getData('user') || null);
    this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`
    this.fileUrl = `${data?.tenant?.url_minio}/`
    this.minioUrl = `${data?.tenant?.url_minio}/`
    this.tenant = data?.tenant;
    this.structureGlobale = data?.structure_organisationnelle;
    this.logoTenant = `${this.fileUrl}${this.tenant?.logo_tenant}`;
    this.grafanaLink = this.tenant?.lien_dashboard_grafana;
    this.approLink = this.tenant?.lien_dashboard_appro;
    this.rejetLink = this.tenant?.lien_dashboard_rejets;
    const newDatatEnv = { ...data?.env, typeNiveau: 'Type Emplacement' };
    this.typeNiveau = newDatatEnv?.typeNiveau;
    this.applicationType = this.tenant?.application;
    this.sourceStockTenantSim = 'Le système utilisera une SIM dans le stock';
    this.sourceStockOrangeSim = "Orange fournira la SIM. A l'issue de l'operation, la SIM sera livrée au point de contact accompagnée d'une facture";
    this.sourceSoldeDotation = 'Le solde de la dotation sera debité du volume demandé'
    if (this.applicationType === ApplicationType.PATRIMOINESIM) {
      this.appName = 'PATRIMOINE SIM'
    } else {
      this.appName = 'SIM MONITORING'
    }
  }

  public GetAllPortefeuille() {
    this.provisionningService
      .GetAllPortefeuille()
      .subscribe({
        next: (res) => {
          this._volumeDataGlobalSource.next(res['data']?.filter((item: any) => { return item.type === 'volume-data' })[0].solde);
          this._ligneCreditSource.next(res['data']?.filter((item: any) => { return item.type === 'ligne-credit' })[0].solde);
        },
        error: (err) => {
        }
      })
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
