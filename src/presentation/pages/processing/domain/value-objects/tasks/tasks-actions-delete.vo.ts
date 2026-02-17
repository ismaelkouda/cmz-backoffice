import { TasksActionsDeleteDto } from '@presentation/pages/processing/application/dto/tasks/tasks-actions-delete.dto';

export class TasksActionsDeleteVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: TasksActionsDeleteDto): TasksActionsDeleteVo {
        return new TasksActionsDeleteVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
