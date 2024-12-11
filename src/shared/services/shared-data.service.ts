import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({ providedIn: "root" })

export class SharedDataService {
  /**
   * TENANTS SIM
   */
  private patrimoineSimDemandesServicesAll = new Subject<void>();
  private patrimoineSimTraitementsDemandesServicesAll = new Subject<void>();
  private patrimoineSimDemandeIntegrationServicesAll = new Subject<void>();

  sendPatrimoineSimDemandesServicesAll() {
    this.patrimoineSimDemandesServicesAll.next();
  }
  postPatrimoineSimDemandesServicesAll(): Observable<void> {
    return this.patrimoineSimDemandesServicesAll.asObservable();
  }
  sendPatrimoineSimTraitementsDemandesAll() {
    this.patrimoineSimTraitementsDemandesServicesAll.next();
  }
  postPatrimoineSimTraitementsDemandesAll(): Observable<void> {
    return this.patrimoineSimTraitementsDemandesServicesAll.asObservable();
  }
  sendPatrimoineSimDemandeIntegrationsAll() {
    this.patrimoineSimDemandeIntegrationServicesAll.next();
  }
  postPatrimoineSimDemandeIntegrationsAll(): Observable<void> {
    return this.patrimoineSimDemandeIntegrationServicesAll.asObservable();
  }


    /**
   * GESTION IDENTIFICATIONS => FILE ATTENTE
   */
    private gestionIdentificationFileAttente = new Subject<void>();

    sendGestionIdentificationsFileAttente() {
      this.gestionIdentificationFileAttente.next();
    }
    postGestionIdentificationsFileAttente(): Observable<void> {
      return this.gestionIdentificationFileAttente.asObservable();
    }
  
}
