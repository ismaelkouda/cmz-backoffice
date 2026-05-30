import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    input,
    output,
    signal,
} from '@angular/core';

import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { ButtonModule } from 'primeng/button';

import { ImakoDateComponent } from '@shared/components/ui/form-elements/imako-date/imako-date.component';
import { ImakoInputComponent } from '@shared/components/ui/form-elements/imako-input/imako-input.component';
import { ImakoMultiSelectComponent } from '@shared/components/ui/form-elements/imako-multi-select/imako-multi-select.component';
import { ImakoSelectComponent } from '@shared/components/ui/form-elements/imako-select/imako-select.component';

import { FilterField } from './filter.types';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'app-filter',

    imports: [
        ReactiveFormsModule,

        NgTemplateOutlet,

        ButtonModule,

        ImakoInputComponent,
        ImakoSelectComponent,
        ImakoMultiSelectComponent,
        ImakoDateComponent,
    ],

    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
    public readonly formGroup = input.required<FormGroup>();

    public readonly fields = input.required<FilterField[]>();

    public readonly isLoading = input(false);

    public readonly limit = input(4);

    public readonly filterState = input<Observable<unknown> | null>(null);

    public readonly filter = output<Record<string, unknown>>();

    public readonly isExpanded = signal(false);

    public readonly primaryFields = computed(() =>
        this.fields().slice(0, this.limit())
    );

    public readonly secondaryFields = computed(() =>
        this.fields().slice(this.limit())
    );

    public readonly hasSecondaryFields = computed(
        () => this.secondaryFields().length > 0
    );

    constructor() {
        effect((onCleanup) => {
            const stream = this.filterState();

            if (!stream) {
                return;
            }

            const subscription = stream.subscribe((state) => {
                if (state === null) {
                    this.formGroup().reset();
                }
            });

            onCleanup(() => {
                subscription.unsubscribe();
            });
        });
    }

    public getControl(name: string): FormControl {
        return this.formGroup().get(name) as FormControl;
    }

    public onSubmitFilterForm(): void {
        this.filter.emit(this.formGroup().getRawValue());
    }

    public toggleExpanded(): void {
        this.isExpanded.update((expanded) => !expanded);
    }

    public trackByFieldName(_: number, field: FilterField): string {
        return field.name;
    }
}
