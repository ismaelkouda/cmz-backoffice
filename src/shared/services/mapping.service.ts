import { EncodingDataService } from './encoding-data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MappingService {


  structureGlobale: any;
  tenant: any;


  constructor(
    private storage: EncodingDataService
  ) {
    const data = JSON.parse(storage.getData('user'));
    this.tenant = data?.tenant;
    this.structureGlobale = data?.structure_organisationnelle;
  }

}
