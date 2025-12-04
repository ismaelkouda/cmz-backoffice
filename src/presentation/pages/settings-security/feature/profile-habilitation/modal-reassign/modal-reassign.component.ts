/* import { CommonModule } from '@angular/common';
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProfileHabilitationFacade } from '@presentation/pages/settings-security/application/profile-habilitation.facade';
import { UsersEntity } from '@presentation/pages/settings-security/domain/entities/users/users.entity';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { Observable, Subject, map } from 'rxjs';

export interface ReassignFormInterface {
    newProfileId: FormControl<string>;
}

export interface ProfileOption {
    id: string;
    name: string;
    description?: string;
}

@Component({
    selector: 'app-modal-reassign',
    standalone: true,
    templateUrl: './modal-reassign.component.html',
    styleUrls: ['./modal-reassign.component.scss'],
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
export class ModalReassignComponent implements OnInit, OnDestroy {
    @Input() visible: boolean = false;
    @Input() profileId: string = '';
    @Input() users: UsersEntity[] = [];
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() confirm = new EventEmitter<{
        newProfileId: string;
        userIds: string[];
    }>();

    private readonly profileHabilitationFacade = inject(
        ProfileHabilitationFacade
    );
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);

    public formReassign!: FormGroup<ReassignFormInterface>;
    public profileOptions$!: Observable<ProfileOption[]>;
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.initForm();
        this.loadProfiles();
    }

    private initForm(): void {
        this.formReassign = this.fb.group<ReassignFormInterface>({
            newProfileId: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    private loadProfiles(): void {
        this.profileOptions$ = this.profileHabilitationFacade
            .getProfilesWithoutUser(this.profileId)
            .pipe(
                map((profiles) =>
                    (profiles || []).map((p) => ({
                        id: p.id,
                        name: p.name,
                        description: p.description,
                    }))
                )
            );
    }

    public onHide(): void {
        this.visibleChange.emit(false);
        this.formReassign.reset();
    }

    public onSubmit(): void {
        if (this.formReassign.valid && this.users.length > 0) {
            const newProfileId =
                this.formReassign.get('newProfileId')?.value ?? '';
            const userIds = this.users.map((u) => u.id);
            this.confirm.emit({ newProfileId, userIds });
            this.onHide();
        } else {
            this.formReassign.markAllAsTouched();
            if (this.users.length === 0) {
                this.toastService.error(
                    this.translate.instant(
                        'SETTINGS_SECURITY.PROFILE_HABILITATION.MESSAGES.NO_SELECTION'
                    )
                );
            } else {
                this.toastService.error(this.translate.instant('FORM_INVALID'));
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
} */