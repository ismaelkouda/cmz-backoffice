import { TasksActionsUpdateDto } from '@pages/processing/application/dto/tasks/tasks-actions-update.dto';

export class TasksActionsUpdateVo {
    public readonly uniqId: string;
    public readonly reportUniqId: string;
    public readonly date: Date | null;
    public readonly type: string;
    public readonly operator: string;
    public readonly description: string;
    public readonly shouldNotifyUser: boolean;
    public readonly isConform: boolean;

    constructor(props: {
        uniqId: string;
        reportUniqId: string;
        date: Date | null;
        type: string;
        operator: string;
        description: string;
        shouldNotifyUser: boolean;
        isConform: boolean;
    }) {
        this.uniqId = props.uniqId;
        this.reportUniqId = props.reportUniqId;
        this.date = props.date;
        this.type = props.type;
        this.operator = props.operator;
        this.description = props.description;
        this.shouldNotifyUser = props.shouldNotifyUser;
        this.isConform = props.isConform;
    }

    static fromDto(dto: TasksActionsUpdateDto): TasksActionsUpdateVo {
        return new TasksActionsUpdateVo({
            uniqId: dto.uniqId,
            reportUniqId: dto.reportUniqId,
            date: dto.date,
            type: dto.type,
            operator: dto.operator,
            description: dto.description,
            shouldNotifyUser: dto.shouldNotifyUser,
            isConform: dto.isConform,
        });
    }
}
