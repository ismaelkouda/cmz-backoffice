import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CurrentUser } from '../interfaces/current-user.interface';
import { EncodingDataService } from './encoding-data.service';

@Injectable({ providedIn: 'root' })

export class StoreCurrentUserService {
  private readonly STORAGE_KEY = 'user_data';

  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(this.getStoredCurrentUser());
  public currentUser$: Observable<CurrentUser | null> = this.currentUserSubject.asObservable();

  constructor(private encodingDataService: EncodingDataService) {}

  public setCurrentUser(user: CurrentUser): void {
    this.encodingDataService.saveData(this.STORAGE_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  public get getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  public removeCurrentUser(): void {
    this.encodingDataService.removeData(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
  }

  public isAuthenticated(): boolean {
    return this.getCurrentUser !== null;
  }

  /** Récupère l'utilisateur stocké dans this.encodingDataService */
  private getStoredCurrentUser(): CurrentUser | null {
    const storedUser = this.encodingDataService.getData(this.STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  }
}
