import { Injectable } from '@angular/core';
import { Status } from '@pages/team-organization/domain/enums/agents-performances/agents-performances-status.enum';
import { StatusDto } from '@pages/team-organization/infrastructure/api/dto/agents-performances/agents-performances-status-api.dto';

@Injectable({ providedIn: 'root' })
export class StatusMapper {
    mapFromDto(dto: StatusDto): Status {
        const methodMap: Record<StatusDto, Status> = {
            [StatusDto.COMPLETED]: Status.COMPLETED,
            [StatusDto.NOT_COMPLETED]: Status.NOT_COMPLETED,
        };
        return methodMap[dto];
    }
    mapToDto(value: Status): StatusDto {
        const methodMap: Record<Status, StatusDto> = {
            [Status.COMPLETED]: StatusDto.COMPLETED,
            [Status.NOT_COMPLETED]: StatusDto.NOT_COMPLETED,
        };
        return methodMap[value];
    }
}
