import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, map } from 'rxjs';
import { CurrentUser } from '../interfaces/current-user.interface';
import { EncodingDataService } from './encoding-data.service';
import { isEqual } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class StoreCurrentUserService {
    private readonly STORAGE_KEY = 'user_data';
    private readonly ENCRYPTION_ENABLED = true;

    private currentUserSubject = new BehaviorSubject<CurrentUser | null>(
        this.getStoredCurrentUser()
    );

    public currentUser$: Observable<CurrentUser | null> =
        this.currentUserSubject.asObservable();
    public isAuthenticated$: Observable<boolean> = this.currentUser$.pipe(
        map((user) => !!user),
        distinctUntilChanged()
    );
    public userPermissions$: Observable<string[]> = this.currentUser$.pipe(
        map((user) => user?.permissions?.map((p) => p.data) || [])
    );

    constructor(private encodingDataService: EncodingDataService) {
        this.setupStorageSync();
    }

    public setCurrentUser(user: CurrentUser): void {
        const sanitizedUser = this.sanitizeUserData(user);
        this.persistUserData(sanitizedUser);
        this.currentUserSubject.next(sanitizedUser);
    }

    public updateCurrentUser(
        updateFn: (user: CurrentUser) => CurrentUser
    ): void {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            const updatedUser = updateFn({ ...currentUser });
            this.setCurrentUser(updatedUser);
        }
    }

    public getCurrentUser(): CurrentUser | null {
        return this.currentUserSubject.value;
    }

    public removeCurrentUser(): void {
        this.encodingDataService.removeData(this.STORAGE_KEY);
        this.currentUserSubject.next(null);
    }

    public hasPermission(permissionKey: string): boolean {
        const user = this.getCurrentUser();
        return (
            user?.permissions?.some((p) => p.data === permissionKey) || false
        );
    }

    public isTokenValid(): boolean {
        const user = this.getCurrentUser();
        if (!user) return false;

        // Implémentation de base - à adapter avec votre logique réelle
        return true;
    }

    private getStoredCurrentUser(): CurrentUser | null {
        try {
            return this.encodingDataService.getData<CurrentUser>(
                this.STORAGE_KEY
            );
        } catch (error) {
            console.error('Error parsing stored user data', error);
            this.removeCurrentUser();
            return null;
        }
    }

    private persistUserData(user: CurrentUser): void {
        this.encodingDataService.saveData(
            this.STORAGE_KEY,
            user,
            this.ENCRYPTION_ENABLED
        );
    }

    private sanitizeUserData(user: CurrentUser): CurrentUser {
        // Clone profond pour éviter les mutations accidentelles
        const sanitized = JSON.parse(JSON.stringify(user));

        // Nettoyage des données sensibles
        delete sanitized.token;
        delete sanitized.password;

        return sanitized;
    }

    private setupStorageSync(): void {
        window.addEventListener('storage', (event) => {
            if (event.key === this.STORAGE_KEY) {
                const newUser = event.newValue
                    ? JSON.parse(event.newValue)
                    : null;

                if (!isEqual(newUser, this.currentUserSubject.value)) {
                    this.currentUserSubject.next(newUser);
                }
            }
        });
    }
}
