import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StoreLocaleService {

  public _tenantDataSource: BehaviorSubject<any> = new BehaviorSubject(null);
  public tenantData$ = this._tenantDataSource.asObservable();

  public _permissionsSource: BehaviorSubject<any> = new BehaviorSubject(null);
  public _permissions$ = this._permissionsSource.asObservable();

  
  public _notifySource: BehaviorSubject<any> = new BehaviorSubject(null);
  public _notify$ = this._notifySource.asObservable();

  constructor() { }

  OnEmitTenantData(item: any) {
    this._tenantDataSource.next(item);
  }
  OnEmitCurrentPermission(item: any) {
    this._permissionsSource.next(item);
  }
  OnEmitNotify(item: any) {
    this._notifySource.next(item);
  }

}
