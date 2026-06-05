import { Provider } from '@angular/core';
import { provideLogout } from './logout.providers';
import { providePasswordChange } from './password-change.providers';
import { provideProfileUpdate } from './profile-update.providers';
import { provideTwoFactorDisable } from './two-factor-disable.providers';
import { provideTwoFactorEnable } from './two-factor-enable.providers';
import { provideTwoFactorRequest } from './two-factor-request.providers';

export function provideMyAccount(): Provider[] {
    return [
        ...provideLogout,
        ...providePasswordChange,
        ...provideProfileUpdate,
        ...provideTwoFactorDisable,
        ...provideTwoFactorEnable,
        ...provideTwoFactorRequest,
    ];
}
