import { Injectable } from '@angular/core';
import { AccessLogsActions } from '@presentation/pages/settings-security/domain/enums/access-logs/access-logs-actions.enum';
import { AccessLogsActionsDto } from '@presentation/pages/settings-security/infrastructure/api/dto/access-logs/access-logs-actions.dto';

@Injectable({
    providedIn: 'root',
})
export class AccessLogsActionsMapper {
    mapToEnum(dtoValue: AccessLogsActionsDto): AccessLogsActions {
        const methodMap: Record<AccessLogsActionsDto, AccessLogsActions> = {
            [AccessLogsActionsDto.LOGIN]: AccessLogsActions.LOGIN,
            [AccessLogsActionsDto.LOGOUT]: AccessLogsActions.LOGOUT,
            [AccessLogsActionsDto.ATTEMPTED_LOGIN]:
                AccessLogsActions.ATTEMPTED_LOGIN,
            [AccessLogsActionsDto.BLOCKED_ATTEMPTED_LOGIN]:
                AccessLogsActions.BLOCKED_ATTEMPTED_LOGIN,
            [AccessLogsActionsDto.ATTEMPTS_EXCEEDED]:
                AccessLogsActions.ATTEMPTS_EXCEEDED,
        };
        return methodMap[dtoValue];
    }

    mapToDto(enumValue: AccessLogsActions): AccessLogsActionsDto {
        const mapping: Record<AccessLogsActions, AccessLogsActionsDto> = {
            [AccessLogsActions.LOGIN]: AccessLogsActionsDto.LOGIN,
            [AccessLogsActions.LOGOUT]: AccessLogsActionsDto.LOGOUT,
            [AccessLogsActions.ATTEMPTED_LOGIN]:
                AccessLogsActionsDto.ATTEMPTED_LOGIN,
            [AccessLogsActions.BLOCKED_ATTEMPTED_LOGIN]:
                AccessLogsActionsDto.BLOCKED_ATTEMPTED_LOGIN,
            [AccessLogsActions.ATTEMPTS_EXCEEDED]:
                AccessLogsActionsDto.ATTEMPTS_EXCEEDED,
        };
        return mapping[enumValue];
    }
}
