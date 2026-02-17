import { FormControl } from '@angular/forms';

export interface MessagingFormControl {
    type: FormControl<string>;
    targetType: FormControl<string>;
    region: FormControl<string>;
    department: FormControl<string>;
    municipality: FormControl<string>;
    channels: FormControl<string[]>;
    subject: FormControl<string>;
    content: FormControl<string>;
    message: FormControl<string>;
}
