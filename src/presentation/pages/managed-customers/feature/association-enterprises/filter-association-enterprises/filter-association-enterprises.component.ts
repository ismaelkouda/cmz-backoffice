import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SelectModule } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';
import { AssociationEnterprisesFilterInterface } from '../../../data-access/association-enterprises/interfaces/association-enterprises-filter.interface';
import { AssociationEnterprisesApiService } from '../../../data-access/association-enterprises/services/association-enterprises-api.service';
import { T_CUSTOMERS_MANAGED_STEP_ENUM } from '../../../data-access/managed-customers/enums/managed-customers-step.enum';

@Component({
    selector: 'app-filter-association-enterprises',
    standalone: true,
    templateUrl: './filter-association-enterprises.component.html',
    animations: [
        trigger('slideInOut', [
            state(
                'void',
                style({
                    transform: 'translateY(-20px)',
                    opacity: 0,
                })
            ),
            transition(':enter', [
                animate(
                    '300ms ease-in',
                    style({
                        transform: 'translateY(0)',
                        opacity: 1,
                    })
                ),
            ]),
            transition(':leave', [
                animate(
                    '300ms ease-out',
                    style({
                        transform: 'translateY(-20px)',
                        opacity: 0,
                    })
                ),
            ]),
        ]),
    ],
    styleUrls: ['./filter-association-enterprises.component.scss'],
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, SelectModule],
})
export class FilterAssociationEnterprisesComponent
    implements OnInit, OnDestroy
{
    @Output() filter = new EventEmitter<
        AssociationEnterprisesFilterInterface | {}
    >();
    @Input()
    listAssociationEnterprisesStep!: T_CUSTOMERS_MANAGED_STEP_ENUM[];

    public formFilter!: FormGroup<AssociationEnterprisesFilterInterface>;
    private destroy$ = new Subject<void>();

    public secondFilter = false;
    public thirdFilter = false;

    constructor(
        private fb: FormBuilder,
        private toastService: ToastrService,
        private translate: TranslateService,
        private associationEnterprisesApiService: AssociationEnterprisesApiService
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
        this.associationEnterprisesApiService
            .getDataFilterAssociationEnterprises()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData: AssociationEnterprisesFilterInterface) => {
                this.formFilter =
                    this.fb.group<AssociationEnterprisesFilterInterface>({
                        date_debut: new FormControl<string>(
                            filterData?.['date_debut'],
                            {
                                nonNullable: true,
                            }
                        ),
                        date_fin: new FormControl<string>(
                            filterData?.['date_fin'],
                            {
                                nonNullable: true,
                            }
                        ),
                        nom_client: new FormControl<string>(
                            filterData?.['nom_client'],
                            {
                                nonNullable: true,
                            }
                        ),
                        code_client: new FormControl<string>(
                            filterData?.['code_client'],
                            {
                                nonNullable: true,
                            }
                        ),
                        compte_client: new FormControl<string>(
                            filterData?.['compte_client'],
                            {
                                nonNullable: true,
                            }
                        ),
                        statut: new FormControl<string>(
                            filterData?.['statut'],
                            {
                                nonNullable: true,
                            }
                        ),
                    });

                if (filterData.date_debut || filterData.date_fin) {
                    this.secondFilter = true;
                }
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
