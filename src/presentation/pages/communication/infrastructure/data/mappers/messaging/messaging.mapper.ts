import { inject, Injectable } from '@angular/core';

import { ActionDropdownMapper } from '@shared/data/mappers/action-dropdown.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { RolesMapper } from '@shared/data/mappers/roles.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import {
    MessagingEntity,
    MessagingProps,
} from '@presentation/pages/communication/domain/entities/messaging/messaging.entity';
import { MessagingItemApiDto } from '@presentation/pages/communication/infrastructure/api/dto/messaging/messaging-response-api.dto';

@Injectable({
    providedIn: 'root',
})
export class MessagingMapper extends PaginatedMapper<
    MessagingEntity,
    MessagingItemApiDto
> {
    private readonly actionDropdownMapper: ActionDropdownMapper =
        inject(ActionDropdownMapper);
    private readonly rolesMapper: RolesMapper = inject(RolesMapper);
    private readonly entityCache = new Map<string, MessagingEntity>();

    protected mapItemFromDto(dto: MessagingItemApiDto): MessagingEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: MessagingProps = {
            uniqId: dto.id,
            reportId: dto.report_id,
            type: dto.type,
            targetType: dto.target_type,
            region: dto.region,
            department: dto.department,
            municipality: dto.municipality,
            channels: dto.channels,
            subject: dto.subject,
            content: dto.content,
            createdAt: dto.created_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new MessagingEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
