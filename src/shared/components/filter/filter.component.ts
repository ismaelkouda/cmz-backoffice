import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ImakoDateComponent } from '@shared/components/ui/form-elements/imako-date/imako-date.component';
import { ImakoInputComponent } from '@shared/components/ui/form-elements/imako-input/imako-input.component';
import { ImakoMultiSelectComponent } from '@shared/components/ui/form-elements/imako-multi-select/imako-multi-select.component';
import { ImakoSelectComponent } from '@shared/components/ui/form-elements/imako-select/imako-select.component';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { Observable } from 'rxjs';
import { FilterField } from './filter.types';

@Component({
    selector: 'app-filter',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        ButtonModule,
        DatePickerModule,
        ImakoInputComponent,
        ImakoSelectComponent,
        ImakoMultiSelectComponent,
        ImakoDateComponent
    ],
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
    public readonly formGroup = input.required<FormGroup>();
    public readonly fields = input.required<FilterField[]>();
    public readonly isLoading = input<boolean>(false);
    public readonly filterState = input<Observable<any> | null>(null);
    public readonly limit = input<number>(4);

    public readonly isExpanded = signal(false);

    public readonly primaryFields = computed(() => this.fields().slice(0, this.limit()));
    public readonly secondaryFields = computed(() => this.fields().slice(this.limit()));

    public readonly filter = output<any>();

    constructor() {
        effect((onCleanup) => {
            const stream = this.filterState();
            if (!stream) return;

            const sub = stream.subscribe((state) => {
                if (state === null) {
                    this.formGroup().reset();
                }
            });

            onCleanup(() => sub.unsubscribe());
        });
    }

    public getControl(name: string) {
        return this.formGroup().get(name) as any;
    }

    public onSubmitFilterForm(): void {
        this.filter.emit(this.formGroup().value);
    }

    public toggleExpanded(): void {
        this.isExpanded.update((v) => !v);
    }
}