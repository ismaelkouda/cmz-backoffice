import { EvaluateProps } from '@pages/report-states/domain/interfaces/evaluate/evaluate-props.interface';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import {
    TelecomOperator,
    TelecomOperatorStyle,
} from '@shared/domain/enums/telecom-operator.enum';
import { TypeReport } from '@shared/domain/enums/type-report.enum';

export class EvaluateEntity implements EvaluateProps {
    constructor(private readonly props: EvaluateProps) {}

    get type(): TypeReport {
        return this.props.type;
    }

    get actionsRef(): string {
        return this.props.uniqId;
    }

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
            [TelecomOperator.MOOV]: TelecomOperatorStyle.MOOV,
            [TelecomOperator.MTN]: TelecomOperatorStyle.MTN,
            [TelecomOperator.ORANGE]: TelecomOperatorStyle.ORANGE,
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

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: EvaluateProps): EvaluateEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new EvaluateEntity(props);
    }
}
