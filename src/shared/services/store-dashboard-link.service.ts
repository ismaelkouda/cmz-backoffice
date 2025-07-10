import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DashboardLink } from '../interfaces/dashboard-link.interface';
import { EncodingDataService } from './encoding-data.service';
import { isEqual } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class StoreDashboardLinkService {
    private readonly STORAGE_KEY = 'link_data';
    private readonly ENCRYPTION_ENABLED = true;

    private dashboardLinksSubject = new BehaviorSubject<DashboardLink | null>(
        this.getStoredDashboardLinks()
    );

    public dashboardLinks$: Observable<DashboardLink | null> =
        this.dashboardLinksSubject.asObservable();

    constructor(private encodingDataService: EncodingDataService) {
        this.setupStorageSync();
    }

    public setDashboardLinks(link: DashboardLink): void {
        const sanitizedUser = this.sanitizeUserData(link);
        this.persistUserData(sanitizedUser);
        this.dashboardLinksSubject.next(sanitizedUser);
    }

    public updateDashboardLinks(
        updateFn: (link: DashboardLink) => DashboardLink
    ): void {
        const dashboardLinks = this.getDashboardLinks();
        if (dashboardLinks) {
            const updatedUser = updateFn({ ...dashboardLinks });
            this.setDashboardLinks(updatedUser);
        }
    }

    public getDashboardLinks(): DashboardLink | null {
        return this.dashboardLinksSubject.value;
    }

    public removeDashboardLinks(): void {
        this.encodingDataService.removeData(this.STORAGE_KEY);
        this.dashboardLinksSubject.next(null);
    }

    private getStoredDashboardLinks(): DashboardLink | null {
        try {
            return this.encodingDataService.getData<DashboardLink>(
                this.STORAGE_KEY
            );
        } catch (error) {
            console.error('Error parsing stored link data', error);
            this.removeDashboardLinks();
            return null;
        }
    }

    private persistUserData(link: DashboardLink): void {
        this.encodingDataService.saveData(
            this.STORAGE_KEY,
            link,
            this.ENCRYPTION_ENABLED
        );
    }

    private sanitizeUserData(link: DashboardLink): DashboardLink {
        // Clone profond pour éviter les mutations accidentelles
        const sanitized = JSON.parse(JSON.stringify(link));

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

                if (!isEqual(newUser, this.dashboardLinksSubject.value)) {
                    this.dashboardLinksSubject.next(newUser);
                }
            }
        });
    }
}
