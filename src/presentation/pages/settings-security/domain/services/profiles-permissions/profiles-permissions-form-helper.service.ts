import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { SETTINGS_SECURITY_ROUTE } from '@shared/routes/routes';

import { PROFILES_PERMISSIONS_ROUTE } from '@presentation/pages/settings-security/settings-security.routes';

@Injectable()
export class ProfilesPermissionsFormHelperService {
    private readonly router = inject(Router);

    navigateToProfilesPermissionsList(): void {
        this.router.navigate([
            SETTINGS_SECURITY_ROUTE + '/' + PROFILES_PERMISSIONS_ROUTE,
        ]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.SWEET_ALERT.TITLE_UPDATE'
            : 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.SWEET_ALERT.TITLE_CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.SWEET_ALERT.MESSAGE_UPDATE'
            : 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.SWEET_ALERT.MESSAGE_CREATE';
    }
}
