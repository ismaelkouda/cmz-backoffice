import { FormControl } from '@angular/forms';
import { AccessLogsActions } from '../../enums/access-logs/access-logs-actions.enum';

export interface AccessLogsFilterControl {
    search: FormControl<string | undefined>;
    action: FormControl<AccessLogsActions | undefined>;
    startDate: FormControl<string | undefined>;
    endDate: FormControl<string | undefined>;
}
