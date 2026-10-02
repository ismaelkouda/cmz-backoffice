import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import SweetAlert from 'sweetalert2';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { SlaEscalationContactsFacade } from '@pages/sla/application/services/sla/sla-escalation-contacts.facade';
import { SlaEscalationContactPayloadApiDto } from '@pages/sla/infrastructure/api/dto/sla/sla-escalation-contact-response-api.dto';
import {
    SLA_ESCALATION_CONTACT_LIST_ROUTE,
    SLA_ESCALATION_CONTACT_ROUTE,
} from './sla-escalation-contacts-paths.constants';

@Component({
    selector: 'app-sla-escalation-contact-form',
    standalone: true,
    imports: [
        BreadcrumbComponent,
        PageTitleComponent,
        TranslateModule,
        ReactiveFormsModule,
        InputTextModule,
        BadgeModule,
        TagModule,
        ButtonModule,
    ],
    templateUrl: './sla-escalation-contact-form.component.html',
    styleUrls: ['./sla-escalation-contact-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlaEscalationContactFormComponent {
    readonly facade = inject(SlaEscalationContactsFacade);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly translate = inject(TranslateService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly languageVersion = signal(0);
    readonly form = new FormGroup({
        lastName: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        firstName: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        }),
        phone: new FormControl('', {
            nonNullable: true,
        }),
        jobTitle: new FormControl('', {
            nonNullable: true,
        }),
        whatsapp: new FormControl('', { nonNullable: true }),
        telegram: new FormControl('', { nonNullable: true }),
    });
    readonly ref = signal<'create' | 'update' | 'view'>('create');
    readonly contactId = signal<string | null>(null);
    readonly isViewMode = computed(() => this.ref() === 'view');
    readonly isEditMode = computed(() => this.ref() === 'update');
    readonly contact = computed(() => this.facade.selected());
    readonly contactFullName = computed(() => {
        const contact = this.contact();
        return (
            [contact?.firstName, contact?.lastName]
                .filter((value): value is string => Boolean(value?.trim()))
                .join(' ') || '—'
        );
    });
    private patchedContactId: string | null = null;
    readonly titleKey = computed(() =>
        this.isViewMode()
            ? 'SLA.ESCALATION_CONTACTS.DETAIL.TITLE'
            : this.isEditMode()
              ? 'SLA.ESCALATION_CONTACTS.FORM.EDIT_TITLE'
              : 'SLA.ESCALATION_CONTACTS.FORM.CREATE_TITLE'
    );
    private readonly contactEffect = effect(() => {
        const contact = this.contact();
        if (
            (!this.isEditMode() && !this.isViewMode()) ||
            !contact ||
            this.patchedContactId === contact.id
        ) {
            return;
        }

        this.form.patchValue({
            lastName: contact.lastName,
            firstName: contact.firstName,
            email: contact.email,
            phone: contact.phone,
            jobTitle: contact.jobTitle,
            whatsapp: contact.whatsapp,
            telegram: contact.telegram,
        });
        this.patchedContactId = contact.id;
        if (this.isViewMode()) {
            this.form.disable({ emitEvent: false });
        }
    });

    constructor() {
        this.route.queryParams
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((params) => {
                const ref = params['ref'];
                this.ref.set(
                    ref === 'update' || ref === 'view' ? ref : 'create'
                );
                const id = params['uniqId'] as string | undefined;
                this.contactId.set(id ?? null);
                this.resetFormState();
                if (id && this.ref() !== 'create') {
                    this.facade.findOne(id);
                }
            });
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.languageVersion.update((version) => version + 1);
            });
    }

    private resetFormState(): void {
        this.patchedContactId = null;
        this.facade.clearSelection();
        this.form.enable({ emitEvent: false });
        this.form.reset(
            {
                lastName: '',
                firstName: '',
                email: '',
                phone: '',
                jobTitle: '',
                whatsapp: '',
                telegram: '',
            },
            { emitEvent: false }
        );
    }

    submit(): void {
        if (this.isViewMode()) {
            return;
        }
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                this.isEditMode()
                    ? 'SLA.ESCALATION_CONTACTS.SWEET_ALERT.TITLE.UPDATE'
                    : 'SLA.ESCALATION_CONTACTS.SWEET_ALERT.TITLE.CREATE'
            ),
            text: this.t('SLA.ESCALATION_CONTACTS.SWEET_ALERT.MESSAGE.SAVE'),
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
            backdrop: false,
        }).then((result): void => {
            if (!result.isConfirmed) {
                return;
            }
            const value = this.form.getRawValue();
            const payload: SlaEscalationContactPayloadApiDto = {
                first_name: value.firstName,
                last_name: value.lastName,
                email: value.email,
                phone: value.phone || undefined,
                job_title: value.jobTitle || undefined,
                whatsapp: value.whatsapp || undefined,
                telegram: value.telegram || undefined,
            };
            const onSuccess = (): void => this.navigateBack();
            const contactId = this.contactId();
            if (this.isEditMode() && contactId) {
                this.facade.update(contactId, payload, onSuccess);
            } else {
                this.facade.create(payload, onSuccess);
            }
        });
    }

    navigateBack(): void {
        this.router.navigate([
            '/sla',
            SLA_ESCALATION_CONTACT_ROUTE,
            SLA_ESCALATION_CONTACT_LIST_ROUTE,
        ]);
    }
    private t(key: string): string {
        return this.translate.instant(key);
    }
}
