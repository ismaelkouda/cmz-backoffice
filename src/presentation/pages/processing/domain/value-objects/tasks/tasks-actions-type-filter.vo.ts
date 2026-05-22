import { TasksActionsTypeFilterDto } from '@presentation/pages/processing/application/dto/tasks/tasks-actions-type-filter.dto';

export class TasksActionsTypeFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(
        dto: TasksActionsTypeFilterDto | null
    ): TasksActionsTypeFilterVo {
        const uniqId = dto?.uniqId;
        if (!uniqId) {
            throw new Error('uniqId is required to reassign tasks action type');
        }
        return new TasksActionsTypeFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
