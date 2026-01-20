import { FormControl } from "@angular/forms";

export interface RegionsFormControl {
    code: FormControl<string>;
    name: FormControl<string>;
    description: FormControl<string>;
}