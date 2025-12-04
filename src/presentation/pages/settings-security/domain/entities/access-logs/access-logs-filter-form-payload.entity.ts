import { FormControl } from '@angular/forms';

export interface AccessLogsFilterFormPayloadEntity {
    created_from: FormControl<string | null>;
    created_to: FormControl<string | null>;
    auth_user_id: FormControl<string | null>;
}
