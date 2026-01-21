import { FormControl } from "@angular/forms";

export interface AccessLogsFilterControl {
    search: FormControl<string | null>;
    action: FormControl<string | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
}