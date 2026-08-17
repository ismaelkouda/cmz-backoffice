import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProfilesPermissionsFilterDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-filter.dto';
import { ProfilesPermissionsFacade } from '@pages/settings-security/application/services/profiles-permissions/profiles-permissions.facade';
import { Status } from '@pages/settings-security/domain/enums/profiles-permissions/profiles-permissions-status.enum';
import { ProfilesPermissionsFilterControl } from '@pages/settings-security/presentation/store/profiles-permissions/profiles-permissions-filter.control';

@Injectable()
export class ProfilesPermissionsFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(ProfilesPermissionsFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<ProfilesPermissionsFilterControl> =
        this.fb.group<ProfilesPermissionsFilterControl>({
            search: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            status: new FormControl<Status | undefined>(undefined, {
                nonNullable: true,
            }),
            user: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
        });

    constructor() {
        const filter = this.currentFilter();

        if (!filter) {
            return;
        }

        this.form.patchValue(filter, {
            emitEvent: false,
        });
    }

    reset(): void {
        this.form.reset();
    }

    get value(): ProfilesPermissionsFilterDto {
        const raw = this.form.getRawValue();

        return {
            search: raw.search || undefined,
            status: raw.status || undefined,
            user: raw.user || undefined,
        };
    }
}
