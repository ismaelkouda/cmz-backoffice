import { AllProps } from '@pages/finalization/domain/interfaces/all/all-props.interface';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import {
    TelecomOperator,
    TelecomOperatorStyle,
} from '@shared/domain/enums/telecom-operator.enum';

export class AllEntity implements AllProps {
    constructor(private readonly props: AllProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get reportType(): ReportType {
        return this.props.reportType;
    }

    get operators(): TelecomOperator[] {
        return this.props.operators;
    }

    operatorsStyle(operator: TelecomOperator): TelecomOperatorStyle {
        const methodMap: Record<TelecomOperator, TelecomOperatorStyle> = {
            [TelecomOperator.MTN]: TelecomOperatorStyle.MTN,
            [TelecomOperator.ORANGE]: TelecomOperatorStyle.ORANGE,
            [TelecomOperator.MOOV]: TelecomOperatorStyle.MOOV,
        };
        return methodMap[operator];
    }

    get source(): ReportSource {
        return this.props.source;
    }

    get initiatorPhoneNumber(): string {
        return this.props.initiatorPhoneNumber;
    }

    get reportedAt(): string {
        return this.props.reportedAt;
    }

    public with(props: AllProps): AllEntity {
        if (this.uniqId === props.uniqId) {
            return this;
        }
        return new AllEntity(props);
    }
}
