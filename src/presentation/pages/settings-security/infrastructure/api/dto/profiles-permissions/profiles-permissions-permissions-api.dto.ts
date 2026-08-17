import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { PermissionApiDto } from './profiles-permissions-find-one-response-api.dto';

export type ProfilesPermissionsPermissionsResponseApiDto = SimpleResponseDto<
    PermissionApiDto[]
>;
