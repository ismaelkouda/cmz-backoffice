import { EncodingDataService } from './encoding-data.service';
import { Injectable } from '@angular/core';

// @ts-ignore
import appConfig from '../../assets/config/app-config.json';

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  structureGlobale: any;
  logoTenant: any;
  tenant: any;
  grafanaLink: string;

  constructor(
    private storage: EncodingDataService
  ) {
    const data = JSON.parse(storage.getData('user'));
    this.tenant = data?.tenant;
    this.structureGlobale = data?.structure_organisationnelle;
    this.logoTenant = `${appConfig.fileUrl}${data?.env?.logo_tenant}`;
    this.grafanaLink = data?.env?.lien_dashboard_grafana;
  }

}
