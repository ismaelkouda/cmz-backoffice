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
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { Observable, startWith, switchMap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { NgTemplateOutlet } from '@angular/common';

import { ImakoDateComponent } from '@shared/components/ui/form-elements/imako-date/imako-date.component';
import { ImakoInputComponent } from '@shared/components/ui/form-elements/imako-input/imako-input.component';
import { ImakoMultiSelectComponent } from '@shared/components/ui/form-elements/imako-multi-select/imako-multi-select.component';
import { ImakoSelectComponent } from '@shared/components/ui/form-elements/imako-select/imako-select.component';
import { FilterField } from './filter.types';

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

    private readonly preventAutoExpand = signal(false);

    public readonly primaryFields = computed(() =>
        this.fields().slice(0, this.limit())
    );
    public readonly secondaryFields = computed(() =>
        this.fields().slice(this.limit())
    );
    public readonly hasSecondaryFields = computed(
        () => this.secondaryFields().length > 0
    );

    private readonly formValue = toSignal(
        toObservable(this.formGroup).pipe(
            switchMap((fg) => fg.valueChanges.pipe(startWith(fg.getRawValue())))
        )
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
                    this.preventAutoExpand.set(false);
                    this.isExpanded.set(false);
                }
            });
            onCleanup(() => subscription.unsubscribe());
        });

        effect(() => {
            const hasSecondaryValue = this.hasSecondaryFieldValue();

            if (!hasSecondaryValue) {
                this.preventAutoExpand.set(false);
                return;
            }

            if (!this.preventAutoExpand() && !this.isExpanded()) {
                this.isExpanded.set(true);
            }
        });
    }

    private hasSecondaryFieldValue(): boolean {
        const value = this.formValue();
        return this.secondaryFields().some((field) =>
            this.hasValue(value?.[field.name])
        );
    }

    private hasValue(value: unknown): boolean {
        if (value === null) {
            return false;
        }

        if (typeof value === 'string') {
            return value.trim().length > 0;
        }

        if (Array.isArray(value)) {
            return value.length > 0;
        }

        return true;
    }

    public getControl(name: string): FormControl {
        return this.formGroup().get(name) as FormControl;
    }

    public onSubmitFilterForm(): void {
        this.filter.emit(this.formGroup().getRawValue());
    }

    public toggleExpanded(): void {
        const collapsing = this.isExpanded();

        this.isExpanded.update((expanded) => !expanded);

        if (collapsing && this.hasSecondaryFieldValue()) {
            this.preventAutoExpand.set(true);
        }
    }

    public trackByFieldName(_: number, field: FilterField): string {
        return field.name;
    }
}
