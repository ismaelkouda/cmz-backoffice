import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SelectModule } from 'primeng/select';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApplicantInterface } from '../../../../../../shared/interfaces/applicant';
import { T_BADGE_STATE_CLAIMS } from '../../../data-access/claims/constants/claims-state.constant';
import { T_BADGE_STEP_CLAIMS } from '../../../data-access/claims/constants/claims-step.constant';
import { claimsFilterInterface } from '../../../data-access/claims/interfaces/claims-filter.interface';
import { ClaimsApiService } from '../../../data-access/claims/services/claims-api.service';
import { T_BADGE_OPERATION_CLAIMS } from './../../../data-access/claims/constants/claims-operation.constant copy';

@Component({
    selector: 'app-filter-claims',
    standalone: true,
    templateUrl: './filter-claims.component.html',
    imports: [ ReactiveFormsModule, TranslateModule, SelectModule ]
})
export class FilterClaimsComponent implements OnDestroy {
    @Input() listApplicants$!: Observable<Array<ApplicantInterface>>;
    @Input() listOperations!: Array<T_BADGE_OPERATION_CLAIMS>;
    @Input() listStepClaims!: Array<T_BADGE_STEP_CLAIMS>;
    @Input() listStateClaims!: Array<T_BADGE_STATE_CLAIMS>;

    @Output() filter = new EventEmitter<claimsFilterInterface>();
    public secondFilter: boolean = false;
    public formFilter!: FormGroup;
    private destroy$ = new Subject<void>();

    constructor(
        private toastService: ToastrService,
        private fb: FormBuilder,
        private translate: TranslateService,
        private claimsApiService: ClaimsApiService
    ) {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        this.claimsApiService
            .getDataFilterClaims()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData: claimsFilterInterface) => {
                this.expandedFirstLine(filterData);
                this.formFilter = this.fb.group<claimsFilterInterface>({
                    operation: new FormControl<string>(
                        filterData?.['operation'],
                        {
                            nonNullable: true,
                        }
                    ),
                    reference: new FormControl<string>(
                        filterData?.['reference'],
                        { nonNullable: true }
                    ),
                    statut: new FormControl<string>(filterData?.['statut'], {
                        nonNullable: true,
                    }),
                    traitement: new FormControl<string>(
                        filterData?.['traitement'],
                        { nonNullable: true }
                    ),
                    date_debut: new FormControl<string>(
                        filterData?.['date_debut'],
                        { nonNullable: true }
                    ),
                    date_fin: new FormControl<string>(
                        filterData?.['date_fin'],
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

    private expandedFirstLine(filterData: claimsFilterInterface): void {
        if (filterData?.date_debut || filterData?.date_fin) {
            this.secondFilter = true;
        }
    }

    public showSecondFilter() {
        this.secondFilter = !this.secondFilter;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
