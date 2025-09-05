import {
    Component,
    Input,
    EventEmitter,
    Output,
    OnInit,
    OnDestroy,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, takeUntil } from 'rxjs';
import { WaitingQueueFilterInterface } from '../../../data-access/waiting-queue/interfaces/waiting-queue-filter.interface';
import { TranslateService } from '@ngx-translate/core';
import { ApplicantInterface } from '../../../../../../shared/interfaces/applicant';
import { T_WAITING_QUEUE_STEP_ENUM } from '../../../data-access/waiting-queue/enums/waiting-queue-step.enum';
import { T_WAITING_QUEUE_STATE_ENUM } from '../../../data-access/waiting-queue/enums/waiting-queue-state.enum';
import { WaitingQueueFilterFormInterface } from '../../../data-access/waiting-queue/interfaces/waiting-queue-filter-form.interface';
import { WaitingQueueApiService } from '../../../data-access/waiting-queue/services/waiting-queue-api.service';
import { T_LIST_REQUESTS_SERVICE } from '../../../../../../shared/enum/list-requests-service';

@Component({
    selector: 'app-filter-waiting-queue',
    templateUrl: './filter-waiting-queue.component.html',
    styleUrls: ['./filter-waiting-queue.component.scss'],
})
export class FilterWaitingQueueComponent implements OnInit, OnDestroy {
    @Output() filter = new EventEmitter<WaitingQueueFilterInterface>();

    @Input() listWaitingQueueStep: Array<T_WAITING_QUEUE_STEP_ENUM>;
    @Input() listWaitingQueueState: Array<T_WAITING_QUEUE_STATE_ENUM>;

    @Input() listApplicants$: Observable<Array<ApplicantInterface>>;
    @Input() listOperations: Array<T_LIST_REQUESTS_SERVICE>;

    public formFilter: FormGroup<WaitingQueueFilterFormInterface>;
    private destroy$ = new Subject<void>();

    public secondFilter: boolean = false;
    public thirdFilter: boolean = false;

    constructor(
        private toastService: ToastrService,
        private fb: FormBuilder,
        private translate: TranslateService,
        private waitingQueueApiService: WaitingQueueApiService
    ) {}

    ngOnInit() {
        this.initFormFilter();
    }

    public showSecondFilter() {
        this.secondFilter = !this.secondFilter;
        this.thirdFilter = false;
    }

    public showThirdFilter() {
        this.thirdFilter = !this.thirdFilter;
    }

    public initFormFilter(): void {
        this.waitingQueueApiService
            .getDataFilterWaitingQueue()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData: WaitingQueueFilterInterface) => {
                this.formFilter =
                    this.fb.group<WaitingQueueFilterFormInterface>({
                        operation: new FormControl<string>(
                            filterData?.operation ?? '',
                            { nonNullable: true }
                        ),
                        date_debut: new FormControl<string>(
                            filterData?.date_debut ?? '',
                            { nonNullable: true }
                        ),
                        date_fin: new FormControl<string>(
                            filterData?.date_fin ?? '',
                            { nonNullable: true }
                        ),
                        nom_tenant: new FormControl<string>(
                            filterData?.nom_tenant ?? '',
                            { nonNullable: true }
                        ),
                        initie_par: new FormControl<string>(
                            filterData?.initie_par ?? '',
                            { nonNullable: true }
                        ),
                        numero_demande: new FormControl<string>(
                            filterData?.numero_demande ?? '',
                            { nonNullable: true }
                        ),
                        statut: new FormControl<string>(
                            filterData?.statut ?? '',
                            { nonNullable: true }
                        ),
                        traitement: new FormControl<string>(
                            filterData?.traitement ?? '',
                            { nonNullable: true }
                        ),
                    });
            });
    }

    public onSubmitFilterForm(): void {
        const date_debut = moment(
            this.formFilter.get('date_debut')?.value
        ).isValid()
            ? this.formFilter.get('date_debut')?.value
            : null;
        const date_fin = moment(
            this.formFilter.get('date_fin')?.value
        ).isValid()
            ? this.formFilter.get('date_fin')?.value
            : null;

        if (
            date_debut &&
            date_fin &&
            moment(date_debut).isAfter(moment(date_fin))
        ) {
            const INVALID_DATE_RANGE =
                this.translate.instant('INVALID_DATE_RANGE');
            this.toastService.error(INVALID_DATE_RANGE);
            return;
        }

        const filterData = {
            ...this.formFilter.value,
            date_debut: date_debut
                ? moment(date_debut).format('YYYY-MM-DD')
                : '',
            date_fin: date_fin ? moment(date_fin).format('YYYY-MM-DD') : '',
        };

        if (this.formFilter.valid) {
            this.filter.emit(filterData);
        } else {
            const translatedMessage = this.translate.instant('FORM_INVALID');
            this.toastService.success(translatedMessage);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
