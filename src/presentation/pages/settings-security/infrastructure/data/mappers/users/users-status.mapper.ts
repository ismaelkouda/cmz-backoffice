import { Injectable } from '@angular/core';
import { Status } from '@pages/settings-security/domain/enums/users/users-status.enum';
import { StatusDto } from '@pages/settings-security/infrastructure/api/dto/users/users-status-api.dto';

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
