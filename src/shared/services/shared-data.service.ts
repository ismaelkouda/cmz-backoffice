import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({ providedIn: "root" })

export class SharedDataService {
  
  /**
   * PATRIMOINE => WHITE SIM CARD
   */
  private patrimoineWhiteSimCard = new Subject<void>();

  sendPatrimoineWhiteSimCard() {
    this.patrimoineWhiteSimCard.next();
  }
  postPatrimoineWhiteSimCard(): Observable<void> {
    return this.patrimoineWhiteSimCard.asObservable();
  }

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
    /**
   * DEMANDES PRODUITS => ACHAT PRODUITS
   */
    private demandesProduitsAchatProduits = new Subject<void>();

    sendDemandesProduitsAchatProduits() {
      this.demandesProduitsAchatProduits.next();
    }
    postDemandesProduitsAchatProduits(): Observable<void> {
      return this.demandesProduitsAchatProduits.asObservable();
    }
    /**
   * COMPTABILITE
   */
    private comptabiliteFacture = new Subject<void>();

    sendComptabiliteFacture() {
      this.comptabiliteFacture.next();
    }
    postComptabiliteFacture(): Observable<void> {
      return this.comptabiliteFacture.asObservable();
    }
  
}
