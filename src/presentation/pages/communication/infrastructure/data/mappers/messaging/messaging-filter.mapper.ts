import { inject, Injectable } from '@angular/core';
import { MessagingFilterApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-filter-api.dto';
import { MessagingTargetMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-target.mapper';
import { MessagingChannelsMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-channels.mapper';
import { MessagingFilterContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-filter.contract';

@Injectable({ providedIn: 'root' })
export class MessagingFilterMapper {
    private readonly targetMapper = inject(MessagingTargetMapper);
    private readonly channelsMapper = inject(MessagingChannelsMapper);

    mapFromEntity(contract: MessagingFilterContract): MessagingFilterApiDto {
        const params: MessagingFilterApiDto = {} as MessagingFilterApiDto;

        if (contract.reportId) {
            params.report_id = contract.reportId;
        }
        if (contract.search) {
            params.search = contract.search;
        }
        if (contract.targetType) {
            params.target_type = this.targetMapper.mapToDto(
                contract.targetType
            );
        }
        if (contract.region) {
            params.region = contract.region;
        }
        if (contract.department) {
            params.department = contract.department;
        }
        if (contract.municipality) {
            params.municipality = contract.municipality;
        }
        if (contract.channels) {
            params.channels = contract.channels.map((channel) =>
                this.channelsMapper.mapToDto(channel)
            );
        }
        if (contract.startDate) {
            params.start_date = contract.startDate;
        }
        if (contract.endDate) {
            params.end_date = contract.endDate;
        }

        return params;
    }
}
