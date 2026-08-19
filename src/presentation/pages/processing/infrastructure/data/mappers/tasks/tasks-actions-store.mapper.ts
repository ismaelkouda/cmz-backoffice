import { TasksActionsCreateValidateContract } from '@pages/processing/domain/contracts/tasks/tasks-actions-create.validate-contract';
import { TasksActionsUpdateValidateContract } from '@pages/processing/domain/contracts/tasks/tasks-actions-update.validate-contract';
import { TasksActionsStoreApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-store-api.dto';
import { ConformityMapper } from '@pages/processing/infrastructure/data/mappers/tasks/tasks-actions-conformity.mapper';

type TasksActionFormProps =
    | TasksActionsCreateValidateContract
    | TasksActionsUpdateValidateContract;

export function mapBaseTasksActionsDto(
    props: TasksActionFormProps,
    conformityMapper: ConformityMapper
): TasksActionsStoreApiDto {
    console.log('props', props);
    return {
        report_uniq_id: props.reportUniqId,
        date: props.date ?? new Date(),
        operator: props.operator.toLowerCase(),
        type_code: props.type,
        description: props.description,
        should_notify_user: Boolean(props.shouldNotifyUser),
        is_visible_for_user: Boolean(props.shouldDisplayInNewspaper),
        result: conformityMapper.mapToDto(props.isConform),
    };
}
