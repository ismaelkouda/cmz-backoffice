import { TasksActionsCreateDto } from '@pages/processing/application/dto/tasks/tasks-actions-create.dto';

export class TasksActionsCreateVo {
    public readonly reportUniqId: string;
    public readonly date: Date | null;
    public readonly type: string;
    public readonly operator: string;
    public readonly description: string;
    public readonly shouldNotifyUser: boolean;
    public readonly isConform: boolean;

    constructor(props: {
        reportUniqId: string;
        date: Date | null;
        type: string;
        operator: string;
        description: string;
        shouldNotifyUser: boolean;
        isConform: boolean;
    }) {
        this.reportUniqId = props.reportUniqId;
        this.date = props.date;
        this.type = props.type;
        this.operator = props.operator;
        this.description = props.description;
        this.shouldNotifyUser = props.shouldNotifyUser;
        this.isConform = props.isConform;
    }

    static fromDto(dto: TasksActionsCreateDto): TasksActionsCreateVo {
        return new TasksActionsCreateVo({
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
