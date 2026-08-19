import { ConformityDto } from './tasks-actions-conformity-api.dto';

export interface TasksActionsUpdateApiDto {
    uniq_id: string;
    report_uniq_id: string;
    date: Date;
    type_code: string;
    operator: string;
    description: string;
    should_notify_user: boolean;
    is_visible_for_user: boolean;
    result: ConformityDto;
}
