import { Injectable } from '@angular/core';
import { Status } from '@pages/team-organization/domain/enums/daily-goal/daily-goal-status.enum';
import { StatusDto } from '@pages/team-organization/infrastructure/api/dto/daily-goal/daily-goal-status-api.dto';

@Injectable({ providedIn: 'root' })
export class StatusMapper {
    mapFromDto(dto: StatusDto): Status {
        const methodMap: Record<StatusDto, Status> = {
            [StatusDto.ACTIVE]: Status.ACTIVE,
            [StatusDto.INACTIVE]: Status.INACTIVE,
        };
        return methodMap[dto];
    }
    mapToDto(value: Status): StatusDto {
        const methodMap: Record<Status, StatusDto> = {
            [Status.ACTIVE]: StatusDto.ACTIVE,
            [Status.INACTIVE]: StatusDto.INACTIVE,
        };
        return methodMap[value];
    }
}
