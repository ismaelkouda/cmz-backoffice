import { TasksActionsCreateDto } from '@pages/processing/application/dto/tasks/tasks-actions-create.dto';

export class TasksActionsCreateVo {
    public readonly reportUniqId: string;
    public readonly date: string;
    public readonly type: string;
    public readonly description: string;
    public readonly shouldNotifyUser: boolean;

    constructor(props: {
        reportUniqId: string;
        date: string;
        type: string;
        description: string;
        shouldNotifyUser: boolean;
    }) {
        this.reportUniqId = props.reportUniqId;
        this.date = props.date;
        this.type = props.type;
        this.description = props.description;
        this.shouldNotifyUser = props.shouldNotifyUser;
    }

    static fromDto(dto: TasksActionsCreateDto): TasksActionsCreateVo {
        return new TasksActionsCreateVo({
            reportUniqId: dto.reportUniqId,
            date: dto.date,
            type: dto.type,
            description: dto.description,
            shouldNotifyUser: dto.shouldNotifyUser,
        });
    }
}
