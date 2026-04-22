import { FormControl } from '@angular/forms';

export interface DailyGoalFilterControl {
    startDate: FormControl<Date | undefined>;
    endDate: FormControl<Date | undefined>;
}
