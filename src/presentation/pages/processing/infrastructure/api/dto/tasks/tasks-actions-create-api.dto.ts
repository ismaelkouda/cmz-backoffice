import { ConformityDto } from './tasks-actions-conformity-api.dto';

export interface TasksActionsCreateApiDto {
    report_uniq_id: string;
    date: Date;
    type_code: string;
    operator: string;
    description: string;
    should_notify_user: boolean;
    result: ConformityDto;
}
