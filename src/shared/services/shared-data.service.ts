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
   * PATRIMOINE => SMS BALANCE STATUS
   */
    private patrimoineSmsBalanceStatus = new Subject<void>();

    sendPatrimoineSmsBalanceStatus() {
      this.patrimoineSmsBalanceStatus.next();
    }
    postPatrimoineSmsBalanceStatus(): Observable<void> {
      return this.patrimoineSmsBalanceStatus.asObservable();
    }

    /**
   * PATRIMOINE => WHITE SIM CARD => DETAILS
   */
    private patrimoineDetailsWhiteSimCard = new Subject<void>();

    sendPatrimoineDetailsWhiteSimCard() {
      this.patrimoineDetailsWhiteSimCard.next();
    }
    postPatrimoineDetailsWhiteSimCard(): Observable<void> {
      return this.patrimoineDetailsWhiteSimCard.asObservable();
    }

        /**
   * PATRIMOINE => SMS BALANCE STATUS => DETAILS
   */
        private patrimoineDetailsSmsBalanceStatus = new Subject<void>();

        sendPatrimoineDetailsSmsBalanceStatus() {
          this.patrimoineDetailsSmsBalanceStatus.next();
        }
        postPatrimoineDetailsSmsBalanceStatus(): Observable<void> {
          return this.patrimoineDetailsSmsBalanceStatus.asObservable();
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

    // REFERENtiel SUPERVISION

        /**
   * PATRIMOINE => SMS BALANCE
   */
    private patrimoineSmsBalance = new Subject<void>();

    sendPatrimoineSmsBalance() {
      this.patrimoineSmsBalance.next();
    }
    postPatrimoineSmsBalance(): Observable<void> {
      return this.patrimoineSmsBalance.asObservable();
    }

    // REFERENtiel SUPERVISION

        /**
   * PATRIMOINE => DATA BALANCE
   */
    private patrimoineDataBalance = new Subject<void>();

    sendPatrimoineDataBalance() {
      this.patrimoineDataBalance.next();
    }
    postPatrimoineDataBalance(): Observable<void> {
      return this.patrimoineDataBalance.asObservable();
    }
  
}
