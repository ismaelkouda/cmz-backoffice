import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    ControlValueAccessor,
    FormControl,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
    selector: 'app-hashtags-input',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        InputTextModule,
        ButtonModule,
        TagModule,
    ],
    templateUrl: './hashtags-input.component.html',
    styleUrl: './hashtags-input.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: HashtagsInputComponent,
            multi: true,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HashtagsInputComponent implements ControlValueAccessor {
    public readonly label = input<string>('Hashtags');
    public readonly required = input<boolean>(false);
    public readonly minHashtags = input<number>(1);
    public readonly maxHashtags = input<number | undefined>(undefined);
    public readonly showStats = input<boolean>(true);
    public readonly allowedPattern = input<string>('^[a-zA-Z0-9_]+$');
    public readonly placeholder = input<string>('Ajouter un hashtag...');

    public readonly hashtagsChanged = output<string[]>();
    public readonly hashtagAdded = output<string>();
    public readonly hashtagRemoved = output<string>();
    public readonly hashtagsCleared = output();

    private readonly destroyRef = inject(DestroyRef);

    public readonly hashtags = signal<string[]>([]);
    public isDisabled = false;
    private onTouched = (): void => {
        console.log('onTouched: ');
    };
    private onChange = (value: string[]): void => {
        console.log('value: ', value);
    };

    protected readonly inputControl = new FormControl('', {
        nonNullable: true,
        validators: [
            Validators.maxLength(50),
            Validators.pattern(this.allowedPattern()),
        ],
        updateOn: 'change',
    });

    protected readonly hashtagsCount = computed(() => this.hashtags().length);

    protected readonly canAddMore = computed(() => {
        const max = this.maxHashtags();
        return !max || this.hashtagsCount() < max;
    });

    protected readonly canClearAll = computed(() => this.hashtagsCount() > 0);

    protected readonly inputError = computed(() => {
        const errors = this.inputControl.errors;
        if (!errors) {
            return null;
        }

        if (errors['duplicate']) {
            return 'VALIDATION.DUPLICATE_HASHTAG';
        }
        if (errors['pattern']) {
            return 'VALIDATION.INVALID_HASHTAG_FORMAT';
        }
        if (errors['maxlength']) {
            return 'VALIDATION.MAX_LENGTH_EXCEEDED';
        }
        return null;
    });

    constructor() {
        this.inputControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                filter(() => !this.isDisabled),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((value) => {
                this.validateInput(value);
            });
    }

    private validateInput(value: string): void {
        console.log('value: ', value);
        const trimmed = value.trim();

        if (!trimmed) {
            this.inputControl.setErrors(null);
            return;
        }

        const existingHashtags = this.hashtags();
        if (existingHashtags.includes(this.formatHashtag(trimmed))) {
            this.inputControl.setErrors({ duplicate: true });
            return;
        }
    }

    private formatHashtag(value: string): string {
        const trimmed = value.trim();
        return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
    }

    private updateParent(value: string[]): void {
        this.onChange(value);
        this.hashtagsChanged.emit(value);
    }

    public addHashtag(event?: Event): void {
        event?.preventDefault();

        const value = this.inputControl.value.trim();

        if (!value || this.inputControl.invalid || !this.canAddMore()) {
            return;
        }

        const formatted = this.formatHashtag(value);
        const current = this.hashtags();
        const updated = [...current, formatted];

        this.hashtags.set(updated);
        this.hashtagAdded.emit(formatted);
        this.updateParent(updated);

        this.inputControl.reset();
    }

    public removeHashtag(index: number): void {
        const current = this.hashtags();
        const removed = current[index];
        const updated = current.filter((_, i) => i !== index);

        this.hashtags.set(updated);
        this.hashtagRemoved.emit(removed);
        this.updateParent(updated);

        this.validateInput(this.inputControl.value);
    }

    public clearAll(): void {
        this.hashtags.set([]);
        this.hashtagsCleared.emit();
        this.updateParent([]);
    }

    writeValue(value: string[] | null): void {
        this.hashtags.set(value?.filter((h) => h !== null) ?? []);
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
            this.inputControl.disable();
        } else {
            this.inputControl.enable();
        }
    }
}
