import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    input,
    signal,
} from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-imako-select',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SelectModule, TranslateModule],
    templateUrl: './imako-select.component.html',
    styleUrls: ['./imako-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: ImakoSelectComponent,
            multi: true,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImakoSelectComponent implements ControlValueAccessor {
    public readonly label = input<string>('');
    public readonly placeholder = input<string>('');
    public readonly options = input<any[]>([]);
    public readonly optionLabel = input<string>('label');
    public readonly optionValue = input<string>('value');
    public readonly showClear = input<boolean>(false);
    public readonly filter = input<boolean>(false);
    public readonly control = input<FormControl>(new FormControl());
    public readonly styleClass = input<string>('');

    protected readonly value = signal<any>('');

    protected onChange!: (value: any) => void;
    protected onTouch!: () => void;

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
