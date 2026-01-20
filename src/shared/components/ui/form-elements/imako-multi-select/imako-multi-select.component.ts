import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
    selector: 'imako-multi-select',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MultiSelectModule, TranslateModule],
    templateUrl: './imako-multi-select.component.html',
    styleUrls: ['./imako-multi-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ImakoMultiSelectComponent),
            multi: true
        }
    ]
})
export class ImakoMultiSelectComponent implements ControlValueAccessor {
    public readonly label = input<string>('');
    public readonly placeholder = input<string>('');
    public readonly options = input<any[]>([]);
    public readonly optionLabel = input<string>('label');
    public readonly optionValue = input<string>('value');
    public readonly showClear = input<boolean>(false);
    public readonly filter = input<boolean>(false);
    public readonly showToggleAll = input<boolean>(true);
    public readonly control = input<FormControl>(new FormControl());
    public readonly styleClass = input<string>('');

    protected readonly value = signal<any>('');

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
