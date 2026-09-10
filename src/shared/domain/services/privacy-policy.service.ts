import { Injectable, computed, inject, signal } from '@angular/core';
import { CurrentUser } from '@shared/domain/interfaces/current-user.interface';
import { EncodingDataService } from './encoding-data.service';
import { PrivacyPolicyApi } from '@presentation/pages/authentication/infrastructure/data/sources/privacy-policy/privacy-policy.api';
import { UiFeedbackService } from './ui-feedback.service';

@Injectable({
    providedIn: 'root',
})
export class PrivacyPolicyService {
    private readonly STORAGE_KEY = 'user_data';

    private readonly encodingDataService = inject(EncodingDataService);
    private readonly api = inject(PrivacyPolicyApi);
    private readonly ui = inject(UiFeedbackService);

    private readonly user = signal<CurrentUser | null>(this.getStoredUser());
    private readonly savAccept = signal(false);

    readonly content = computed(() => this.user()?.privacy?.content ?? null);
    readonly saving = computed(() => this.savAccept());

    readonly mustAccept = computed(() => {
        const current = this.user();
        return !!current && current.privacy?.accepted_at === null;
    });

    refresh(): void {
        this.user.set(this.getStoredUser());
    }

    /**
     * Rappel du 403 'PRIVACY_NOT_ACCEPTED' côté backend : ré-armer
     * l'acceptation locale pour que le dialogue se réaffiche lors de
     * la prochaine navigation.
     */
    markNotAccepted(): void {
        const current = this.getStoredUser();
        if (!current) {
            return;
        }
        const updated: CurrentUser = {
            ...current,
            privacy: {
                ...current.privacy,
                accepted_at: null,
            },
        };
        this.encodingDataService.saveData(this.STORAGE_KEY, updated, true);
        this.user.set(updated);
    }

    accept(): void {
        if (this.savAccept()) {
            return;
        }
        this.savAccept.set(true);
        this.api.accept().subscribe({
            next: (response) => {
                this.savAccept.set(false);
                if (response.error) {
                    this.ui.error(response.message);
                    return;
                }
                this.persistAcceptance();
            },
            error: (err) => {
                this.savAccept.set(false);
                this.ui.notifyError(err);
            },
        });
    }

    private persistAcceptance(): void {
        const current = this.getStoredUser();
        if (!current) {
            return;
        }
        const updated: CurrentUser = {
            ...current,
            privacy: {
                ...current.privacy,
                accepted_at: new Date().toISOString(),
            },
        };
        this.encodingDataService.saveData(this.STORAGE_KEY, updated, true);
        this.user.set(updated);
    }

    private getStoredUser(): CurrentUser | null {
        return this.encodingDataService.getData<CurrentUser>(this.STORAGE_KEY);
    }
}
