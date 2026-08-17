import { Injectable, signal, computed, inject } from '@angular/core';
import { EncodingDataService } from '@shared/domain/services/encoding-data.service';

@Injectable({ providedIn: 'root' })
export class PermissionActionsService {
    private readonly encoding = inject(EncodingDataService);

    private readonly _permissions = signal<Record<string, string[]>>(
        this.encoding.getData('permissionsActions') || {}
    );

    readonly permissions = this._permissions.asReadonly();

    can = (route: string, action: string) =>
        computed(() => this._permissions()?.[route]?.includes(action) ?? false);
}
