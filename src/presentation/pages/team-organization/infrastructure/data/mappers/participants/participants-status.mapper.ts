import { Injectable } from '@angular/core';

import { Status } from '@presentation/pages/team-organization/domain/enums/participants/participants-status.enum';
import { StatusDto } from '@presentation/pages/team-organization/infrastructure/api/dto/participants/participants-status-api.dto';

@Injectable({ providedIn: 'root' })
export class StatusMapper {
    mapFromDto(dto: StatusDto): Status {
        const methodMap: Record<StatusDto, Status> = {
            [StatusDto.ACTIVE]: Status.ACTIVE,
            [StatusDto.INACTIVE]: Status.INACTIVE,
            [StatusDto.BLOCKED]: Status.BLOCKED,
            [StatusDto.PENDING]: Status.PENDING,
        };
        return methodMap[dto];
    }
    mapToDto(value: Status): StatusDto {
        const methodMap: Record<Status, StatusDto> = {
            [Status.ACTIVE]: StatusDto.ACTIVE,
            [Status.INACTIVE]: StatusDto.INACTIVE,
            [Status.BLOCKED]: StatusDto.BLOCKED,
            [Status.PENDING]: StatusDto.PENDING,
        };
        return methodMap[value];
    }
}
