import { TasksActionsFilterDto } from '@pages/processing/application/dto/tasks/tasks-actions-filter.dto';

export class TasksActionsFilterVo {
    public readonly uniqId: string;

    private constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: TasksActionsFilterDto): TasksActionsFilterVo {
        return new TasksActionsFilterVo({ uniqId: dto.uniqId });
    }
}
