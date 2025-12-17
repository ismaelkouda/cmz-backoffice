import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, forwardRef, inject, input, OnDestroy, OnInit, output, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormArray, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-hashtags-input',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        InputTextModule,
        ButtonModule,
        TagModule
    ],
    templateUrl: './hashtags-input.component.html',
    styleUrl: './hashtags-input.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => HashtagsInputComponent),
            multi: true
        }
    ]
})
export class HashtagsInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
    public label = input<string>('Hashtags');
    public placeholder = input<string>('Ajouter un hashtag...');
    public required = input<boolean>(true);
    public minHashtags = input<number>(1);
    public maxHashtags = input<number | undefined>(undefined);
    public showValidationErrors = input<boolean>(true);
    public showStats = input<boolean>(true);
    public allowedPattern = input<string>('^[a-zA-Z0-9_]+$');

    public hashtagsChanged = output<string[]>();
    public hashtagAdded = output<string>();
    public hashtagRemoved = output<string>();
    public hashtagsCleared = output<void>();

    private readonly fb = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);

    public form: FormGroup;
    public currentHashtagControl: FormControl;

    public hashtagsCount: Signal<number> = signal(0);
    public canAddMore: Signal<boolean> = signal(true);
    public canClearAll: Signal<boolean> = signal(false);

    private onChange: (value: string[]) => void = () => { };
    private onTouched: () => void = () => { };
    private isDisabled = false;

    constructor() {
        this.form = this.fb.group({
            hashtags: this.fb.array<string>([], this.hashtagsArrayValidator.bind(this))
        });

        this.currentHashtagControl = this.fb.control('', [
            Validators.pattern(this.allowedPattern()),
            Validators.maxLength(50)
        ]);

        this.hashtagsCount = computed(() => this.hashtagsArray.length);
        this.canAddMore = computed(() => {
            const max = this.maxHashtags();
            return !max || this.hashtagsCount() < max;
        });
        this.canClearAll = computed(() => this.hashtagsCount() > 0);
    }

    ngOnInit(): void {
        this.setupFormListeners();
    }

    ngOnDestroy(): void {
        // Gestion automatique avec DestroyRef
    }

    private setupFormListeners(): void {
        // Écoute des changements du champ actuel
        this.currentHashtagControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.validateCurrentHashtag();
            });

        // Écoute des changements de l'array
        this.hashtagsArray.valueChanges
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((hashtags: string[]) => {
                this.onChange(hashtags);
                this.hashtagsChanged.emit(hashtags);
            });
    }

    get hashtagsArray(): FormArray {
        return this.form.get('hashtags') as FormArray;
    }

    private hashtagsArrayValidator(control: any): { [key: string]: any } | null {
        if (this.required() && control.length < this.minHashtags()) {
            return { minHashtags: { required: this.minHashtags(), actual: control.length } };
        }

        const max = this.maxHashtags();
        if (max && control.length > max) {
            return { maxHashtags: { max, actual: control.length } };
        }

        const values = control.value as string[];
        const duplicates = values.filter((item, index) => values.indexOf(item) !== index);
        if (duplicates.length > 0) {
            return { duplicateHashtags: duplicates };
        }

        return null;
    }

    private validateCurrentHashtag(): void {
        const value = this.currentHashtagControl.value?.trim();

        if (!value) {
            this.currentHashtagControl.setErrors(null);
            return;
        }

        if (value.length > 50) {
            this.currentHashtagControl.setErrors({ maxlength: { requiredLength: 50, actualLength: value.length } });
            return;
        }

        const pattern = new RegExp(this.allowedPattern());
        if (!pattern.test(value)) {
            this.currentHashtagControl.setErrors({ pattern: true });
            return;
        }

        const existingHashtags = this.hashtagsArray.value;
        if (existingHashtags.includes(value)) {
            this.currentHashtagControl.setErrors({ duplicate: true });
            return;
        }

        this.currentHashtagControl.setErrors(null);
    }

    public addHashtag(event?: Event): void {
        if (event) {
            event.preventDefault();
        }

        if (!this.canAddCurrentHashtag()) {
            return;
        }

        const value = this.formatHashtag(this.currentHashtagControl.value);
        console.log("value", value);
        console.log("this.hashtagsArray", this.hashtagsArray.value);

        this.hashtagsArray.push(this.fb.control(value, Validators.required));

        this.hashtagAdded.emit(value);

        this.currentHashtagControl.reset();
        this.currentHashtagControl.markAsUntouched();

        setTimeout(() => {
            const input = document.querySelector('.hashtag-input') as HTMLInputElement;
            if (input) input.focus();
        });
    }

    public removeHashtag(index: number): void {
        const removedHashtag = this.hashtagsArray.at(index).value;

        this.hashtagsArray.removeAt(index);
        this.hashtagRemoved.emit(removedHashtag);

        this.hashtagsArray.markAsTouched();
        this.hashtagsArray.updateValueAndValidity();
    }

    public clearAll(): void {
        this.hashtagsArray.clear();
        this.hashtagsCleared.emit();

        this.hashtagsArray.markAsTouched();
        this.hashtagsArray.updateValueAndValidity();
    }

    private formatHashtag(value: string): string {
        console.log(value);
        const trimmed = value.trim();
        return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
    }

    public canAddCurrentHashtag(): boolean {
        return this.currentHashtagControl.valid &&
            this.currentHashtagControl.value?.trim() &&
            this.canAddMore();
    }

    public onBlur(): void {
        this.onTouched();

        if (this.currentHashtagControl.valid && this.currentHashtagControl.value?.trim()) {
            this.addHashtag();
        }
    }

    public getHashtagTrackBy(index: number, control: any): string {
        return `${index}-${control.value}`;
    }

    public getErrorMessage(errors: any): string {
        if (!errors) return '';

        if (errors.required) return 'VALIDATION.REQUIRED';
        if (errors.pattern) return 'VALIDATION.INVALID_HASHTAG_FORMAT';
        if (errors.maxlength) return 'VALIDATION.MAX_LENGTH_EXCEEDED';
        if (errors.duplicate) return 'VALIDATION.DUPLICATE_HASHTAG';

        return 'VALIDATION.INVALID_INPUT';
    }

    writeValue(value: string[]): void {
        if (value && Array.isArray(value)) {
            this.hashtagsArray.clear();

            value.forEach(hashtag => {
                const formatted = this.formatHashtag(hashtag);
                this.hashtagsArray.push(this.fb.control(formatted, Validators.required));
            });
        } else {
            this.hashtagsArray.clear();
        }
    }

    registerOnChange(fn: (value: string[]) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;

        if (isDisabled) {
            this.currentHashtagControl.disable();
            this.hashtagsArray.disable();
        } else {
            this.currentHashtagControl.enable();
            this.hashtagsArray.enable();
        }
    }
}