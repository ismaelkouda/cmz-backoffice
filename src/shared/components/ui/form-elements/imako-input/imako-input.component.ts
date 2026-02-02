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
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-imako-input',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        TranslateModule,
    ],
    templateUrl: './imako-input.component.html',
    styleUrls: ['./imako-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: ImakoInputComponent,
            multi: true,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImakoInputComponent implements ControlValueAccessor {
    public readonly label = input<string>('');
    public readonly placeholder = input<string>('');
    public readonly required = input<boolean>(false);
    public readonly type = input<string>('text');
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
