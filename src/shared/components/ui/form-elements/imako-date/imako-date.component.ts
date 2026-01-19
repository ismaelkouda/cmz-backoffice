
import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'imako-date',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DatePickerModule, TranslateModule],
    templateUrl: './imako-date.component.html',
    styleUrls: ['./imako-date.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ImakoDateComponent),
            multi: true
        }
    ]
})
export class ImakoDateComponent implements ControlValueAccessor {
    public readonly label = input<string>('');
    public readonly placeholder = input<string>('');
    public readonly required = input<boolean>(false);
    public readonly control = input<FormControl>(new FormControl());
    public readonly styleClass = input<string>('');
    public readonly showIcon = input<boolean>(true);
    public readonly dateFormat = input<string>('yy-mm-dd');
    public readonly appendTo = input<string>('body');
    public readonly showButtonBar = input<boolean>(true);
    public readonly selectionMode = input<'single' | 'multiple' | 'range'>('single');

    // Internal signal for value
    protected readonly value = signal<any>(null);

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
