import { Injectable } from '@angular/core';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { UserInfo } from '@shared/domain/interfaces/user-info.interface';
import {
    ActionType,
    ActionsEntity,
} from '../../domain/entities/actions/actions.entity';
import { ActionsItemDto } from '../dtos/actions/actions-response.dto';

@Injectable({ providedIn: 'root' })
export class ActionsMapper extends PaginatedMapper<
    ActionsEntity,
    ActionsItemDto
> {
    protected override mapItemFromDto(dto: ActionsItemDto): ActionsEntity {
        return {
            id: dto.id,
            reportUniqId: dto.report_uniq_id,
            date: dto.date,
            type: this.mapActionType(dto.type),
            description: dto.description,
            createdBy: this.mapUserInfo(dto.created_by),
            updatedBy: this.mapUserInfo(dto.updated_by),
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
        };
    }

    private mapActionType(type: string): ActionType {
        const validTypes: ActionType[] = [
            'ANALYSIS',
            'TREATMENT',
            'VERIFICATION',
            'CORRECTION',
            'VALIDATION',
            'OTHER',
        ];
        return validTypes.includes(type as ActionType)
            ? (type as ActionType)
            : 'OTHER';
    }

    private mapUserInfo(user: ActionsItemDto['created_by']): UserInfo {
        return {
            id: user.id,
            last_name: user.last_name,
            first_name: user.first_name,
            phone: user.phone,
        };
    }
}
