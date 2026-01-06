import { Injectable } from '@angular/core';
import { TreaterInfoEntity } from '@shared/domain/entities/treater-info.entity';
import { TreaterInfoDto } from '../dtos/treater-info.dto';
@Injectable({
    providedIn: 'root',
})
export class TreaterInfoMapper {
    mapToDto(treaterInfo: TreaterInfoEntity): TreaterInfoDto {
        return {
            acknowledged_at: treaterInfo.acknowledgedAt,
            created_at: treaterInfo.createdAt,
            reported_at: treaterInfo.reportedAt,
            processed_at: treaterInfo.processedAt,
            approved_at: treaterInfo.approvedAt,
            finalized_at: treaterInfo.finalizedAt,
            rejected_at: treaterInfo.rejectedAt,
            confirmed_at: treaterInfo.confirmedAt,
            abandoned_at: treaterInfo.abandonedAt,
            processed_comment: treaterInfo.processedComment,
            approved_comment: treaterInfo.approvedComment,
            rejected_comment: treaterInfo.rejectedComment,
            acknowledged_comment: treaterInfo.acknowledgedComment,
            confirmed_comment: treaterInfo.confirmedComment,
            abandoned_comment: treaterInfo.abandonedComment,
            deny_count: treaterInfo.denyCount,
            reason: treaterInfo.reason,
        };
    }

    mapToEntity(treaterInfoDto: TreaterInfoDto): TreaterInfoEntity {
        return new TreaterInfoEntity(
            treaterInfoDto.acknowledged_at,
            treaterInfoDto.created_at,
            treaterInfoDto.reported_at,
            treaterInfoDto.processed_at,
            treaterInfoDto.approved_at,
            treaterInfoDto.finalized_at,
            treaterInfoDto.rejected_at,
            treaterInfoDto.confirmed_at,
            treaterInfoDto.abandoned_at,
            treaterInfoDto.processed_comment,
            treaterInfoDto.approved_comment,
            treaterInfoDto.rejected_comment,
            treaterInfoDto.acknowledged_comment,
            treaterInfoDto.confirmed_comment,
            treaterInfoDto.abandoned_comment,
            treaterInfoDto.deny_count,
            treaterInfoDto.reason
        );
    }
}
