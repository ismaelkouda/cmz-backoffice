import { CommonModule } from "@angular/common";
import { Component, OnInit, computed, effect, inject, untracked } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { MunicipalitiesFacade } from "@presentation/pages/administrative-boundary/core/application/services/municipalities/municipalities.facade";
import { RegionsSelectFacade } from "@presentation/pages/administrative-boundary/core/application/services/regions/regions-select.facade";
import { MUNICIPALITIES_TABLE_CONST } from "@presentation/pages/administrative-boundary/core/domain/constants/municipalities/municipalities-table.constants";
import { MunicipalitiesFilterControl } from "@presentation/pages/administrative-boundary/core/domain/controls/municipalities/municipalities-filter.control";
import { MunicipalitiesEntity } from "@presentation/pages/administrative-boundary/core/domain/entities/municipalities/municipalities.entity";
import { FilterComponent } from "@shared/components/filter/filter.component";
import { FilterField } from "@shared/components/filter/filter.types";
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { TableComponent } from "@shared/components/table/table.component";
import { SWEET_ALERT_PARAMS } from "@shared/constants/swalWithBootstrapButtonsParams.constant";
import { Paginate } from "@shared/data/dtos/simple-response.dto";
import { CrudFormType } from "@shared/domain/utils/crud-form-utils";
import { parseAndValidateDateRange } from "@shared/domain/utils/date-range.utils";
import { AppCustomizationService } from "@shared/services/app-customization.service";
import { TableExportExcelFileService } from "@shared/services/table-export-excel-file.service";
import { ToastrService } from "ngx-toastr";
import SweetAlert from 'sweetalert2';
import { MUNICIPALITIES_FORM } from "../../municipalities/municipalities.routes";

@Component({
    selector: "app-municipalities-list",
    standalone: true,
    imports: [CommonModule, FilterComponent, TableComponent, PaginationComponent, ReactiveFormsModule],
    templateUrl: "./municipalities-list.component.html",
    styleUrls: ["./municipalities-list.component.scss"],
})
export class MunicipalitiesListComponent implements OnInit {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    public readonly facade = inject(MunicipalitiesFacade);
    public readonly regionFacade = inject(RegionsSelectFacade);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);
    private readonly tableExportExcelFileService = inject(TableExportExcelFileService);
    private readonly appCustomizationService = inject(AppCustomizationService);
    public readonly tableConfig = MUNICIPALITIES_TABLE_CONST;

    public formFilter: FormGroup<MunicipalitiesFilterControl> = this.fb.group<MunicipalitiesFilterControl>({
        search: new FormControl<string | null>(null),
        regionCode: new FormControl<string | null>(null),
        departmentCode: new FormControl<string | null>(null),
        isActive: new FormControl<boolean | null>(null),
        startDate: new FormControl<string | null>(null),
        endDate: new FormControl<string | null>(null),
    });

    readonly regions = toSignal(this.regionFacade.items$, { initialValue: [] });
    private readonly selectedRegionCode = toSignal(this.formFilter.controls.regionCode.valueChanges, { initialValue: null });

    readonly filteredDepartments = computed(() => {
        const regionCode = this.selectedRegionCode();
        console.log(regionCode);
        if (!regionCode) return [];

        const region = this.regions().find(r => r.code === regionCode);
        return region?.departments || [];
    });

    private readonly filterData = toSignal(this.facade.currentFilter$, { initialValue: null });
    readonly municipalities = toSignal(this.facade.items$, { initialValue: [] });
    readonly isLoading = toSignal(this.facade.isLoading$, { initialValue: false });
    readonly pagination = toSignal(this.facade.pagination$, { initialValue: {} as Paginate<MunicipalitiesEntity> });
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );
    readonly filterFields = computed<FilterField[]>(() => [
        {
            type: 'text',
            name: 'search',
            label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.SEARCH',
            placeholder: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.SEARCH_PLACEHOLDER',
        },
        {
            type: 'select',
            name: 'regionCode',
            label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.REGION',
            placeholder: 'COMMON.SELECT_PLACEHOLDER',
            options: this.regions(),
            optionLabel: 'name',
            optionValue: 'code',
            showClear: true,
            filter: true,
        },
        {
            type: 'select',
            name: 'departmentCode',
            label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.DEPARTMENT',
            placeholder: this.selectedRegionCode()
                ? 'COMMON.SELECT_PLACEHOLDER'
                : 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.SELECT_REGION_FIRST',
            options: this.filteredDepartments(),
            optionLabel: 'name',
            optionValue: 'code',
            showClear: true,
            filter: true,
        },
        {
            type: 'date',
            name: 'startDate',
            label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.DATE.FROM',
            placeholder: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.DATE.PLACEHOLDER',
        },
        {
            type: 'date',
            name: 'endDate',
            label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.DATE.TO',
            placeholder: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.DATE.PLACEHOLDER',
        }
    ]);
    public statusOptions: { label: string; value: boolean }[] = [];

    constructor() {
        this.title.setTitle(this.translate.instant("ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TITLE"));

        effect(() => {
            this.facade.readAll();
            this.regionFacade.readAll(true);
        });

        effect(() => {
            const filter = this.filterData();
            const regionCode = this.selectedRegionCode();
            console.log("regionCode", regionCode);

            untracked(() => {
                if (filter) {
                    this.formFilter.patchValue({
                        search: filter.search,
                        departmentCode: filter.departmentCode,
                        isActive: filter.isActive,
                        startDate: filter.startDate,
                        endDate: filter.endDate,
                    }, { emitEvent: false });
                }

                const deptControl = this.formFilter.controls.departmentCode;
                if (!regionCode) {
                    deptControl.disable({ emitEvent: false });
                    deptControl.setValue(null, { emitEvent: false });
                } else {
                    deptControl.enable({ emitEvent: false });
                }

                if (regionCode && deptControl.value) {
                    const isValid = this.filteredDepartments().some(d => d.code === deptControl.value);
                    if (!isValid) {
                        deptControl.setValue(null, { emitEvent: false });
                    }
                }
            });
        });
    }

    ngOnInit(): void {
        this.loadTranslatedOptions();
    }

    private loadTranslatedOptions(): void {
        this.statusOptions = [
            { label: this.translate.instant('COMMON.ACTIVATED'), value: true },
            {
                label: this.translate.instant('COMMON.DEACTIVATED'),
                value: false,
            },
        ];
    }

    public filter(formValue: any): void {
        const {
            startDate,
            endDate,
            isValidRange
        } = parseAndValidateDateRange(formValue.startDate, formValue.endDate);
        if (!isValidRange) {
            this.toastService.error(
                this.translate.instant('COMMON.INVALID_DATE_RANGE')
            );
            return;
        }
        const filter = {
            search: formValue.search,
            regionCode: formValue.regionCode,
            departmentCode: formValue.departmentCode,
            isActive: formValue.isActive,
            startDate: startDate?.format('YYYY-MM-DD'),
            endDate: endDate?.format('YYYY-MM-DD')
        };
        this.facade.readAll(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.facade.changePage(event + 1);
    }

    public refresh(): void {
        this.facade.refresh();
    }

    public onCreateClicked({ ref }: { ref: CrudFormType }): void {
        this.router.navigate([MUNICIPALITIES_FORM], {
            relativeTo: this.activatedRoute,
            queryParams: {
                ref: ref,
            },
        });
    }

    public onEditClicked({ item, ref }: { item: MunicipalitiesEntity, ref: CrudFormType }): void {
        this.router.navigate([MUNICIPALITIES_FORM], {
            relativeTo: this.activatedRoute,
            queryParams: {
                code: item.code,
                ref: ref,
            },
        });
    }

    public onViewClicked(item: MunicipalitiesEntity): void {
        /* this.router.navigate([item.uniqId, MUNICIPALITIES_VIEW_ROUTE], {
            relativeTo: this.activatedRoute,
        }); */
    }

    public onDeleteClicked(item: MunicipalitiesEntity): void {
        if (!item.code) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.TITLE_DELETE'),
            text: `${this.translate.instant('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.MESSAGE_DELETE')}`,
            backdrop: false,
            confirmButtonText: this.translate.instant('COMMON.CONFIRM'),
            cancelButtonText: this.translate.instant('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.delete(item.code).subscribe(() => this.facade.refreshWithLastFilterAndPage());
            }
        });
    }

    /* public onBadgeClick(event: { item: MunicipalitiesEntity; col: HTMLTableCellElement }): void {
        this.router.navigate([MUNICIPALITIES_BY_MUNICIPALITIE_ID_ROUTE, event.item.uniqId], { relativeTo: this.activatedRoute, queryParams: { name: event.item.name, createdAt: event.item.createdAt } });
    } */

    public onExportExcel(): void {
        const municipalities = this.municipalities();
        if (municipalities && municipalities.length > 0) {
            const fileName = `${this.exportFilePrefix}-municipalities`;
            this.tableExportExcelFileService.exportAsExcelFile(
                municipalities,
                this.tableConfig,
                fileName
            );
        } else {
            this.toastService.error(this.translate.instant('EXPORT.NO_DATA'));
        }
    }

    private normalizeExportPrefix(appName: string): string {
        return (
            appName
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
    }
}