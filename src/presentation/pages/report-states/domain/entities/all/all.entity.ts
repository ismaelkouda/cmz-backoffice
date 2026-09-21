import {
    Conformity,
    ConformityStyle,
} from '@presentation/pages/processing/domain/enums/tasks/tasks-actions-conformity.enum';
import { AllProps } from '@pages/report-states/domain/interfaces/all/all-props.interface';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import {
    TelecomOperator,
    TelecomOperatorStyle,
} from '@shared/domain/enums/telecom-operator.enum';
import { TypeReport } from '@shared/domain/enums/type-report.enum';

export class AllEntity implements AllProps {
    constructor(private readonly props: AllProps) {}

    get type(): TypeReport {
        return this.props.type;
    }

    get actionsRef(): string {
        return this.props.uniqId;
    }

    get uniqId(): string {
        return this.props.uniqId;
    }

    get requestReportUniqId(): string {
        return this.props.requestReportUniqId;
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

    get requestReportsCount(): number {
        return this.props.requestReportsCount;
    }

    get reportedAt(): string {
        return this.props.reportedAt;
    }

    get isConform(): Conformity {
        return this.props.isConform;
    }

    conformStyle(conform: Conformity): ConformityStyle {
        const methodMap: Record<Conformity, ConformityStyle> = {
            [Conformity.CONFORM]: ConformityStyle.CONFORM,
            [Conformity.NON_CONFORM]: ConformityStyle.NON_CONFORM,
            [Conformity.IN_PROGRESS]: ConformityStyle.IN_PROGRESS,
            [Conformity.UNKNOWN]: ConformityStyle.UNKNOWN,
        };
        return methodMap[conform];
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: AllProps): AllEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new AllEntity(props);
    }
}
