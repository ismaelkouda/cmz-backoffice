import { FormControl } from '@angular/forms';

export interface AccessLogsFilterFormPayloadEntity {
    start_date: FormControl<string | null>;
    end_date: FormControl<string | null>;
    auth_user_id: FormControl<string | null>;
}
