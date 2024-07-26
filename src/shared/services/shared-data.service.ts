import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({ providedIn: "root" })

export class SharedDataService {
  /**
   * TENANTS SIM
   */
  private patrimoineSimDemandesServicesAll = new Subject<void>();

  sendPatrimoineSimDemandesServicesAll() {
    this.patrimoineSimDemandesServicesAll.next();
  }
  postPatrimoineSimDemandesServicesAll(): Observable<void> {
    return this.patrimoineSimDemandesServicesAll.asObservable();
  }
  
}
