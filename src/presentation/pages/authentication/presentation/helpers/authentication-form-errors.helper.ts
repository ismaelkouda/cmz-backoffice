import { FormControl } from '@angular/forms';

export function getControlError(
    control: FormControl,
    messages: Record<string, string>
): string | null {
    if (!control.touched || !control.errors) {
        return null;
    }

    const errorKey = Object.keys(control.errors)[0];

    return messages[errorKey] ?? null;
}
