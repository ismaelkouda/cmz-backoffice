import { FormControl } from '@angular/forms';
import { Conformity } from '@presentation/pages/processing/domain/enums/tasks/tasks-actions-conformity.enum';
export interface TasksActionsFormControl {
    date: FormControl<Date | null>;
    type: FormControl<string>;
    description: FormControl<string>;
    operator: FormControl<string>;
    shouldNotifyUser: FormControl<boolean>;
    isConform: FormControl<Conformity | null>;
}
