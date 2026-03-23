import { TasksActionsUpdateDto } from '@pages/processing/application/dto/tasks/tasks-actions-update.dto';

export class TasksActionsUpdateVo {
    public readonly uniqId: string;
    public readonly reportUniqId: string;
    public readonly date: Date | null;
    public readonly type: string;
    public readonly description: string;
    public readonly shouldNotifyUser: boolean;

    constructor(props: {
        uniqId: string;
        reportUniqId: string;
        date: Date | null;
        type: string;
        description: string;
        shouldNotifyUser: boolean;
    }) {
        this.uniqId = props.uniqId;
        this.reportUniqId = props.reportUniqId;
        this.date = props.date;
        this.type = props.type;
        this.description = props.description;
        this.shouldNotifyUser = props.shouldNotifyUser;
    }

    static fromDto(dto: TasksActionsUpdateDto): TasksActionsUpdateVo {
        return new TasksActionsUpdateVo({
            uniqId: dto.uniqId,
            reportUniqId: dto.reportUniqId,
            date: dto.date,
            type: dto.type,
            description: dto.description,
            shouldNotifyUser: dto.shouldNotifyUser,
        });
    }
}
