import { Injectable } from '@angular/core';
import { ReportByChannelEntity } from '@pages/reporting/domain/entities/report-by-channel/report-by-channel.entity';
import { ReportByChannelItemDto } from '@pages/reporting/infrastructure/api/dto/report-by-channel/report-by-channel-response.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

@Injectable({ providedIn: 'root' })
export class ReportByChannelMapper extends SimpleResponseMapper<
    ReportByChannelEntity,
    ReportByChannelItemDto
> {
    protected override mapItemFromDto(
        dto: ReportByChannelItemDto
    ): ReportByChannelEntity {
        return new ReportByChannelEntity(dto.reportByChannel);
    }
}
