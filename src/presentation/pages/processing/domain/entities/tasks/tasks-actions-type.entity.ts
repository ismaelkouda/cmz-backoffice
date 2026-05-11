import { TasksActionsTypeItemApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-type-api.dto';

export class TasksActionsTypeEntity {
    constructor(
        public readonly value: string,
        public readonly label: string
    ) {}

    static fromDto(dto: TasksActionsTypeItemApiDto): TasksActionsTypeEntity {
        return new TasksActionsTypeEntity(dto.code, dto.name);
    }

    public with(dto: TasksActionsTypeItemApiDto): TasksActionsTypeEntity {
        if (this.value === dto.code && this.label === dto.name) {
            return this;
        }
        return TasksActionsTypeEntity.fromDto(dto);
    }
}
