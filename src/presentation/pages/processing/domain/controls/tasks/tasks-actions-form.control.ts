import { FormControl } from '@angular/forms';

export interface TasksActionsFormControl {
    date: FormControl<string>;
    type: FormControl<string>;
    description: FormControl<string>;
    shouldNotifyUser: FormControl<boolean>;
}
