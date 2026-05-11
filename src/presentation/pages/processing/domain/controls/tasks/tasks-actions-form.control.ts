import { FormControl } from '@angular/forms';

export interface TasksActionsFormControl {
    date: FormControl<Date | null>;
    type: FormControl<string>;
    description: FormControl<string>;
    operator: FormControl<string>;
    shouldNotifyUser: FormControl<boolean>;
    isConform: FormControl<boolean>;
}
