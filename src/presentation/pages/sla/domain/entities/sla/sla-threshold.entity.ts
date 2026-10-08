import { SlaThresholdProps } from '@pages/sla/domain/interfaces/sla/sla-threshold-props.interface';
import {
    ThresholdType,
    ThresholdValue,
} from '@pages/sla/domain/types/sla/sla-threshold.types';

export class SlaThresholdEntity implements SlaThresholdProps {
    constructor(private readonly props: SlaThresholdProps) {}

    get id(): string | number {
        return this.props.id;
    }
    get slaId(): string | number {
        return this.props.slaId;
    }
    get slaType(): string {
        return this.props.slaType;
    }
    get slaName(): string {
        return this.props.slaName;
    }
    get slaDescription(): string {
        return this.props.slaDescription;
    }
    get slaCategory(): string {
        return this.props.slaCategory;
    }
    get reportTypeId(): string | number | null {
        return this.props.reportTypeId;
    }
    get reportTypeCode(): string {
        return this.props.reportTypeCode;
    }
    get reportTypeName(): string {
        return this.props.reportTypeName;
    }
    get threshold(): ThresholdValue {
        return this.props.threshold;
    }
    get thresholdType(): ThresholdType {
        return this.props.thresholdType;
    }
    get thresholdLabel(): string {
        return this.props.thresholdLabel;
    }
    get criticalThreshold(): ThresholdValue {
        return this.props.criticalThreshold;
    }
    get criticalThresholdType(): ThresholdType {
        return this.props.criticalThresholdType;
    }
    get criticalThresholdLabel(): string {
        return this.props.criticalThresholdLabel;
    }
    get unit(): string {
        return this.props.unit;
    }
    get channel(): string {
        return this.props.channel;
    }
    get description(): string {
        return this.props.description;
    }
    get createdAt(): string {
        return this.props.createdAt;
    }
    get updatedAt(): string {
        return this.props.updatedAt;
    }

    with(props: SlaThresholdProps): SlaThresholdEntity {
        if (this.id === props.id && this.updatedAt === props.updatedAt) {
            return this;
        }
        return new SlaThresholdEntity(props);
    }
}
