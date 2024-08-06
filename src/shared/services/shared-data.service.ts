import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({ providedIn: "root" })

export class SharedDataService {
  /**
   * TENANTS SIM
   */
  private patrimoineSimDemandesServicesAll = new Subject<void>();
  private patrimoineSimTraitementsDemandesServicesAll = new Subject<void>();

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
  
}
