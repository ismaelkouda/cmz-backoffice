import { Injectable } from '@angular/core';
import { SlaThresholdUpdateContract } from '@pages/sla/domain/contracts/sla/sla-threshold-update.contract';
import { SlaChannelOptionEntity } from '@pages/sla/domain/entities/sla/sla-channel-option.entity';
import { SlaThresholdEntity } from '@pages/sla/domain/entities/sla/sla-threshold.entity';
import { SlaThresholdProps } from '@pages/sla/domain/interfaces/sla/sla-threshold-props.interface';
import {
    ThresholdType,
    ThresholdValue,
} from '@pages/sla/domain/types/sla/sla-threshold.types';
import { ReportTypeItemApiDto } from '@pages/sla/infrastructure/api/dto/sla/report-type-response-api.dto';
import { SlaThresholdUpdateApiDto } from '@pages/sla/infrastructure/api/dto/sla/sla-threshold-update-api.dto';

@Injectable({ providedIn: 'root' })
export class SlaThresholdMapper {
    mapItem(dto: ReportTypeItemApiDto): SlaThresholdEntity {
        const thresholdType = this.getThresholdType(dto.threshold, dto.unit);
        const criticalThresholdType = this.getThresholdType(
            dto.critical_threshold,
            dto.unit
        );
        const props: SlaThresholdProps = {
            id: dto.id,
            slaId: dto.sla_id,
            slaType: dto.sla_type,
            slaName: dto.sla_name,
            slaDescription: dto.sla_description,
            slaCategory: dto.sla_category,
            reportTypeId: dto.report_type_id ?? null,
            reportTypeCode: dto.report_type ?? '',
            reportTypeName: dto.report_type_name ?? '',
            threshold: this.parseThreshold(dto.threshold, dto.unit),
            thresholdType,
            thresholdLabel: String(dto.threshold),
            criticalThreshold: this.parseThreshold(
                dto.critical_threshold,
                dto.unit
            ),
            criticalThresholdType,
            criticalThresholdLabel: String(dto.critical_threshold),
            unit: dto.unit,
            channel: dto.channel.toLowerCase(),
            description: dto.description,
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };
        return new SlaThresholdEntity(props);
    }

    mapChannelOption(dto: {
        id: string;
        name: string;
    }): SlaChannelOptionEntity {
        return { id: dto.id, name: dto.name };
    }

    mapUpdate(contract: SlaThresholdUpdateContract): SlaThresholdUpdateApiDto {
        return {
            id: contract.id,
            sla_id: contract.slaId,
            threshold: contract.threshold,
            critical_threshold: contract.criticalThreshold,
        };
    }

    private getThresholdType(
        value: ThresholdValue,
        unit: string
    ): ThresholdType {
        if (unit.toUpperCase() === 'DATE') {
            return 'date';
        }
        if (unit.toUpperCase() === 'FCFA') {
            return 'currency';
        }
        return String(value).replace(/\s/g, '').includes('.')
            ? 'decimal'
            : 'integer';
    }

    private parseThreshold(
        value: ThresholdValue,
        unit: string
    ): ThresholdValue {
        if (unit.toUpperCase() === 'DATE') {
            return String(value);
        }
        const normalized = String(value)
            .replace(/\s/g, '')
            .replace(/[^\d.-]/g, '');
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : 0;
    }
}
