import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'imako-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, TranslateModule],
    templateUrl: './imako-input.component.html',
    styleUrls: ['./imako-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ImakoInputComponent),
            multi: true
        }
    ]
})
export class ImakoInputComponent implements ControlValueAccessor {
    public readonly label = input<string>('');
    public readonly placeholder = input<string>('');
    public readonly required = input<boolean>(false);
    public readonly type = input<string>('text');
    public readonly control = input<FormControl>(new FormControl());
    public readonly styleClass = input<string>('');

    // Internal signal for value (though mainly handled via control)
    protected readonly value = signal<any>('');

    // CVA methods
    onChange: any = () => { };
    onTouch: any = () => { };

    writeValue(value: any): void {
        this.value.set(value);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled) {
            this.control().disable();
        } else {
            this.control().enable();
        }
    }
}
