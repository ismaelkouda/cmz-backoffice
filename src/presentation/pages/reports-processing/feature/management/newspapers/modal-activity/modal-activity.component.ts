import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { Observable, Subject } from 'rxjs';

export interface ActivityFormInterface {
    newProfileId: FormControl<string>;
}

export interface ProfileOption {
    id: string;
    name: string;
    description?: string;
}

@Component({
    selector: 'app-modal-activity',
    standalone: true,
    templateUrl: './modal-activity.component.html',
    styleUrls: ['./modal-activity.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        DialogModule,
        SelectModule,
        ButtonModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalActivityComponent implements OnInit, OnDestroy {
    @Input() visible: boolean = false;
    @Input() reportUniqId!: string;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() closed = new EventEmitter<void>();
    private readonly fb = inject(FormBuilder);

    public formActivity!: FormGroup<ActivityFormInterface>;
    public profileOptions$!: Observable<ProfileOption[]>;
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.initForm();
    }

    private initForm(): void {
        this.formActivity = this.fb.group<ActivityFormInterface>({
            newProfileId: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    public onHide(): void {
        this.closed.emit();
        this.formActivity.reset();
    }

    public onSubmit(): void {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
