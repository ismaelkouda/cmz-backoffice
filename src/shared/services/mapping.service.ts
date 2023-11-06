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
  public typeNiveau: string;
  public baseUrl: string;
  public fileUrl: string;
  public minioUrl: string;
  public localCalendar: any;

  _volumeDataGlobalSource: BehaviorSubject<string> = new BehaviorSubject('');
  volumeDataGlobal$ = this._volumeDataGlobalSource.asObservable();


  constructor(
    private storage: EncodingDataService,
    private provisionningService: ProvisionningService
  ) {
    this.GetAllPortefeuille();
    const data = JSON.parse(this.storage.getData('user'));
    this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`
    this.fileUrl = `${data?.tenant?.url_backend}/`
    this.minioUrl = `${data?.tenant?.url_minio}/`
    this.tenant = data?.tenant;
    this.structureGlobale = data?.structure_organisationnelle;
    this.logoTenant = `${this.fileUrl}${this.tenant?.logo_tenant}`;
    this.grafanaLink = this.tenant?.lien_dashboard_grafana;
    const newDatatEnv = { ...data?.env, typeNiveau: 'Type Emplacement' };
    this.typeNiveau = newDatatEnv?.typeNiveau;
  }

    public GetAllPortefeuille(){
    this.provisionningService
    .GetAllPortefeuille()
     .subscribe({
       next: (res)=>{
        console.log("res",res);
        this._volumeDataGlobalSource.next(res['data']?.filter((item:any)=>{ return item.type === 'volume-data'})[0].solde);          
       },
       error: (err)=>{
     }
     })
 }



}
