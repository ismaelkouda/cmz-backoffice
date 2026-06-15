import {
    Conformity,
    ConformityStyle,
} from '@presentation/pages/processing/domain/enums/tasks/tasks-actions-conformity.enum';
import { TasksActionsProps } from '@presentation/pages/processing/domain/interfaces/tasks/tasks-actions/tasks-actions-props.interface';
import {
    TelecomOperator,
    TelecomOperatorStyle,
} from '@shared/domain/enums/telecom-operator.enum';
import { formatDateSafe } from '@shared/domain/functions/format-date';

export type TasksActionsType =
    | 'ANALYSIS'
    | 'TREATMENT'
    | 'VERIFICATION'
    | 'CORRECTION'
    | 'VALIDATION'
    | 'OTHER';

export class TasksActionsEntity implements TasksActionsProps {
    constructor(private readonly props: TasksActionsProps) {}

    get actionsRef(): string {
        return this.props.type;
    }

    get uniqId(): string {
        return this.props.uniqId;
    }

    get date(): Date {
        return this.props.date;
    }

    get formatDate(): string {
        return formatDateSafe(this.props.date);
    }

    get type(): string {
        return this.props.type;
    }

    get code(): string {
        return this.props.code;
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

    get description(): string {
        return this.props.description;
    }

    get shouldNotifyUser(): boolean {
        return this.props.shouldNotifyUser;
    }

    get autoChecked(): boolean {
        return this.props.autoChecked;
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

    get createdBy(): string {
        return this.props.createdBy;
    }

    get updatedBy(): string {
        return this.props.updatedBy;
    }

    get createdAt(): string {
        return this.props.createdAt;
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: TasksActionsProps): TasksActionsEntity {
        if (
            this.uniqId === props.uniqId &&
            this.updatedAt === props.updatedAt
        ) {
            return this;
        }
        return new TasksActionsEntity(props);
    }
}
