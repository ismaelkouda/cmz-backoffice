import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsFilterVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-filter.vo';
import { ProfilesPermissionsFilterApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-filter-api.dto';
import { StatusMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-status.mapper';

@Injectable({
    providedIn: 'root',
})
export class ProfilesPermissionsFilterMapper {
    private readonly statusMapper = inject(StatusMapper);
    map(vo: ProfilesPermissionsFilterVo): ProfilesPermissionsFilterApiDto {
        const params: ProfilesPermissionsFilterApiDto = {};

        if (vo.search) {
            params.search = vo.search;
        }
        if (vo.user) {
            params.user = vo.user;
        }
        if (vo.status) {
            params.is_active = this.statusMapper.mapStatusToApi(vo.status);
        }

        return params;
    }
}
