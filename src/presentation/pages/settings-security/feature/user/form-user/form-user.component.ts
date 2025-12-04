/* import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserFacade } from '@presentation/pages/settings-security/application/user.facade';
import { UsersEntity } from '@presentation/pages/settings-security/domain/entities/users/users.entity';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Observable, Subject, map, of, switchMap, takeUntil } from 'rxjs';

export interface UserFormInterface {
    lastName: FormControl<string>;
    firstName: FormControl<string>;
    uniqId: FormControl<string>;
    matricule: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
}

@Component({
    selector: 'app-form-user',
    standalone: true,
    templateUrl: './form-user.component.html',
    styleUrls: ['./form-user.component.scss'],
    imports: [
        CommonModule,
        AsyncPipe,
        ReactiveFormsModule,
        TranslateModule,
        InputTextModule,
        SelectModule,
        ButtonModule,
        BreadcrumbComponent,
        InputMaskModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormUserComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly userFacade = inject(UserFacade);
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);

    public formUser!: FormGroup<UserFormInterface>;
    public module!: string;
    public subModule!: string;
    public user$!: Observable<UsersEntity | null>;
    public readOnly: boolean = false;
    public profileOptions = [
        {
            value: 'admin',
            label: 'SETTINGS_SECURITY.USER.OPTIONS.PROFIL.ADMIN',
        },
        {
            value: 'user',
            label: 'SETTINGS_SECURITY.USER.OPTIONS.PROFIL.USER',
        },
    ] as const;
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.initForm();
        this.setupRouteData();
        this.loadUserData();
    }

    private initForm(): void {
        this.formUser = this.fb.group<UserFormInterface>({
            lastName: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            firstName: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            uniqId: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            matricule: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            email: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required, Validators.email],
            }),
            phone: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    private setupRouteData(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ?? 'SETTINGS_SECURITY.USER.FORM.CREATE_TITLE'
                );
                this.module = data['module'] ?? 'SETTINGS_SECURITY.LABEL';
                this.subModule =
                    data['subModule'] ?? 'SETTINGS_SECURITY.USER.LABEL';
            });

        this.activatedRoute.queryParams
            .pipe(takeUntil(this.destroy$))
            .subscribe((params) => {
                this.readOnly = params['view'] === 'true';
            });
    }

    private loadUserData(): void {
        this.user$ = this.activatedRoute.params.pipe(
            map((params) => params['id']),
            switchMap((id) => {
                if (id) {
                    return this.userFacade.users$.pipe(
                        map((users) => users.find((u) => u.id === id) ?? null)
                    );
                }
                return of(null);
            })
        );

        this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
            if (user && this.formUser) {
                this.formUser.patchValue({
                    lastName: user.lastName,
                    firstName: user.firstName,
                    uniqId: user.uniqId,
                    matricule: user.matricule,
                    email: user.email,
                });
            } else if (this.formUser) {
                this.formUser.reset();
            }
        });
    }

    public onCancel(): void {
        this.router.navigate(['..'], { relativeTo: this.activatedRoute });
    }

    public onSubmit(): void {
        if (this.formUser.valid) {
            const formValue = this.formUser.getRawValue();
            const payload = {
                lastName: formValue.lastName.trim(),
                firstName: formValue.firstName.trim(),
                uniqId: formValue.uniqId.trim(),
                matricule: formValue.matricule.trim(),
                email: formValue.email.trim(),
            };

            this.user$
                .pipe(
                    switchMap((user) => {
                        if (user) {
                            return this.userFacade.updateUser({
                                id: user.id,
                                ...payload,
                            });
                        }
                        return this.userFacade.storeUser(payload);
                    }),
                    takeUntil(this.destroy$)
                )
                .subscribe({
                    next: () => {
                        this.router.navigate(['..'], {
                            relativeTo: this.activatedRoute,
                        });
                    },
                    error: () => {
                        // Error handled in facade
                    },
                }); 
        } else {
            this.formUser.markAllAsTouched();
            const translatedMessage = this.translate.instant('FORM_INVALID');
            this.toastService.error(translatedMessage);
        }
    }

    public get isEditMode(): Observable<boolean> {
        return this.user$.pipe(map((user) => !!user));
    }

    public get pageTitle(): Observable<string> {
        return this.user$.pipe(
            map((user) =>
                user
                    ? 'SETTINGS_SECURITY.USER.FORM.EDIT_TITLE'
                    : 'SETTINGS_SECURITY.USER.FORM.CREATE_TITLE'
            )
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
 */