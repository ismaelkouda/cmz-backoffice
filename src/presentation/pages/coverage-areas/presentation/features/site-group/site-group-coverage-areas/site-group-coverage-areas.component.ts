import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    computed,
    effect,
    inject,
    signal,
    Signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SiteGroupSelectFacade } from '@pages/coverage-areas/application/services/site-group/site-group-select.facade';
import { SiteGroupCoverageAreasFacade } from '@pages/coverage-areas/application/services/site-group/site-group-coverage-areas.facade';
import { SiteGroupCoverageAreaEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-coverage-area.entity';
import { SITE_GROUP_COVERAGE_AREAS_TABLE } from '@pages/coverage-areas/presentation/adapters/site-group/site-group-coverage-areas-table.constant';
import {
    SITE_GROUP_LIST,
    SITE_GROUP_ROUTE,
} from '@pages/coverage-areas/presentation/features/site-group/site-group-paths.constants';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import {
    enumToFilterOptionsWithValue,
    FilterField,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { SelectOption } from '@shared/domain/interfaces/select-option.interface';
import { COVERAGE_AREAS_ROUTE } from '@shared/routes/routes';
import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';
import { Technology } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-technology.enum';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import SweetAlert from 'sweetalert2';
import { map } from 'rxjs';

@Component({
    selector: 'app-site-group-coverage-areas',
    standalone: true,
    templateUrl: './site-group-coverage-areas.component.html',
    styleUrls: ['./site-group-coverage-areas.component.scss'],
    imports: [
        BreadcrumbComponent,
        PageTitleComponent,
        FilterComponent,
        TableComponent,
        TranslateModule,
        ButtonModule,
        TagModule,
        DialogModule,
        MultiSelectModule,
        SelectModule,
        ReactiveFormsModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteGroupCoverageAreasComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly destroyRef = inject(DestroyRef);
    readonly facade = inject(SiteGroupCoverageAreasFacade);
    readonly siteGroupSelectFacade = inject(SiteGroupSelectFacade);

    readonly tableConfig = SITE_GROUP_COVERAGE_AREAS_TABLE;
    readonly groupId = toSignal(
        this.route.queryParams.pipe(map((params) => Number(params['uniqId']))),
        { initialValue: 0 }
    );
    readonly groupName = toSignal(
        this.route.queryParams.pipe(map((params) => params['name'] ?? '')),
        { initialValue: '' }
    );
    readonly items = this.facade.items;
    readonly filteredItems = computed(() => {
        const filter = this.activeFilter();
        const search = filter.search.trim().toLowerCase();
        const startDate = filter.startDate?.getTime();
        const endDate = filter.endDate?.getTime();

        return this.items().filter((item) => {
            const matchesSearch =
                !search ||
                [
                    item.site_id,
                    item.site_name,
                    item.operator,
                    item.network_technology.join(' '),
                ].some((value) => String(value).toLowerCase().includes(search));
            const matchesTowerSize =
                filter.towerSize === null ||
                filter.towerSize === undefined ||
                Number(item.tower_height) === Number(filter.towerSize);
            const matchesTechnology =
                !filter.technology ||
                item.network_technology.includes(filter.technology);
            const matchesOperator =
                !filter.operator ||
                item.operator.toLowerCase() === filter.operator.toLowerCase();
            const matchesRadius =
                filter.radius === null ||
                filter.radius === undefined ||
                Number(item.coverage_radius) === Number(filter.radius);
            const updatedAt = new Date(item.updated_at).getTime();
            const matchesStartDate = !startDate || updatedAt >= startDate;
            const matchesEndDate = !endDate || updatedAt <= endDate;

            return (
                matchesSearch &&
                matchesTowerSize &&
                matchesTechnology &&
                matchesOperator &&
                matchesRadius &&
                matchesStartDate &&
                matchesEndDate
            );
        });
    });
    readonly loading = this.facade.loading;
    readonly selectedItems = signal<SiteGroupCoverageAreaEntity[]>([]);
    readonly displayAssignModal = signal(false);
    readonly displayReassignModal = signal(false);
    private lastActionSuccess = this.facade.actionSuccess();
    readonly currentLang = signal(this.translate.getCurrentLang());
    readonly siteGroups = toSignal(this.siteGroupSelectFacade.items$, {
        initialValue: [] as SelectOption[],
    });
    readonly unassignedItems = computed(() =>
        this.facade.unassignedItems().map((item) => ({
            label: item.name,
            value: item.id,
        }))
    );
    readonly actionLoading = computed(
        () => this.facade.actionState() === 'loading'
    );
    readonly filterForm = this.fb.group({
        search: this.fb.nonNullable.control(''),
        towerSize: this.fb.control<number | null>(null),
        technology: this.fb.control<string | null>(null),
        operator: this.fb.control<string | null>(null),
        radius: this.fb.control<number | null>(null),
        startDate: this.fb.control<Date | null>(null),
        endDate: this.fb.control<Date | null>(null),
    });
    readonly activeFilter = signal(this.filterForm.getRawValue());
    readonly technologyOptions: Signal<FilterOption[]> = computed(() =>
        enumToFilterOptionsWithValue(Technology, this.t.bind(this))
    );
    readonly operatorOptions: Signal<FilterOption[]> = computed(() =>
        enumToFilterOptionsWithValue(Operator, this.t.bind(this))
    );
    readonly filterFields = computed<FilterField[]>(() => [
        {
            type: 'text',
            name: 'search',
            label: this.t('COVERAGE_AREAS.MOBILE_NETWORK.FILTER.SEARCH'),
            placeholder: this.t(
                'COVERAGE_AREAS.MOBILE_NETWORK.FILTER.SEARCH_PLACEHOLDER'
            ),
        },
        {
            type: 'text',
            name: 'towerSize',
            label: this.t('COVERAGE_AREAS.MOBILE_NETWORK.FILTER.TOWER_SIZE'),
            placeholder: this.t(
                'COVERAGE_AREAS.MOBILE_NETWORK.FILTER.TOWER_SIZE_PLACEHOLDER'
            ),
            inputType: 'number',
        },
        {
            type: 'select',
            name: 'technology',
            label: this.t('COVERAGE_AREAS.MOBILE_NETWORK.FILTER.TECHNOLOGY'),
            placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
            options: this.technologyOptions(),
            optionLabel: 'label',
            optionValue: 'value',
            showClear: true,
        },
        {
            type: 'select',
            name: 'operator',
            label: this.t('COVERAGE_AREAS.MOBILE_NETWORK.FILTER.OPERATOR'),
            placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
            options: this.operatorOptions(),
            optionLabel: 'label',
            optionValue: 'value',
            showClear: true,
        },
        {
            type: 'text',
            name: 'radius',
            label: this.t('COVERAGE_AREAS.MOBILE_NETWORK.FILTER.RADIUS'),
            placeholder: this.t(
                'COVERAGE_AREAS.MOBILE_NETWORK.FILTER.RADIUS_PLACEHOLDER'
            ),
            inputType: 'number',
        },
        {
            type: 'date',
            name: 'startDate',
            label: 'COVERAGE_AREAS.MOBILE_NETWORK.FILTER.DATE.FROM',
            placeholder:
                'COVERAGE_AREAS.MOBILE_NETWORK.FILTER.DATE.PLACEHOLDER',
        },
        {
            type: 'date',
            name: 'endDate',
            label: 'COVERAGE_AREAS.MOBILE_NETWORK.FILTER.DATE.TO',
            placeholder:
                'COVERAGE_AREAS.MOBILE_NETWORK.FILTER.DATE.PLACEHOLDER',
        },
    ]);
    readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.ASSIGN',
            actionId: 'assign',
            class: 'btn-primary',
            icon: 'pi pi-plus',
            translateKey: 'COMMON.ASSIGN',
            disabled: this.selectedItems().length > 0,
        },
        {
            label: 'COMMON.REASSIGN',
            actionId: 'reassign',
            class: 'btn-warning',
            icon: 'pi pi-arrow-right-arrow-left',
            translateKey: 'COMMON.REASSIGN',
            disabled: this.selectedItems().length === 0,
        },
        {
            label: 'COMMON.REMOVE',
            actionId: 'remove',
            class: 'btn-danger',
            icon: 'pi pi-trash',
            translateKey: 'COMMON.REMOVE',
            disabled: this.selectedItems().length === 0,
        },
    ]);

    readonly assignForm = this.fb.nonNullable.group({
        coverageAreaIds: this.fb.control<number[]>([], Validators.required),
    });
    readonly reassignForm = this.fb.nonNullable.group({
        siteGroupId: this.fb.control<string | null>(null, Validators.required),
    });

    constructor() {
        effect(() => {
            const id = this.groupId();
            if (id) {
                this.facade.read(id);
            }
        });
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event) => this.currentLang.set(event.lang));
        effect(() => {
            const currentSuccess = this.facade.actionSuccess();
            if (currentSuccess === this.lastActionSuccess) {
                return;
            }
            this.closeAssign();
            this.closeReassign();
            this.selectedItems.set([]);
            this.lastActionSuccess = currentSuccess;
        });
    }

    ngOnInit(): void {
        this.siteGroupSelectFacade.readAll({ forceRefresh: true });
    }

    onFilter(value: Record<string, unknown>): void {
        this.filterForm.patchValue({
            search: String(value['search'] ?? ''),
            towerSize: value['towerSize'] ? Number(value['towerSize']) : null,
            technology: (value['technology'] as string | null) ?? null,
            operator: (value['operator'] as string | null) ?? null,
            radius: value['radius'] ? Number(value['radius']) : null,
            startDate: (value['startDate'] as Date | null) ?? null,
            endDate: (value['endDate'] as Date | null) ?? null,
        });
        this.activeFilter.set(this.filterForm.getRawValue());
    }

    onRefresh(): void {
        this.filterForm.reset();
        this.activeFilter.set(this.filterForm.getRawValue());
        if (this.groupId()) {
            this.facade.read(this.groupId(), true);
        }
    }

    onSelectionChange(
        selection: SiteGroupCoverageAreaEntity | SiteGroupCoverageAreaEntity[]
    ): void {
        this.selectedItems.set(
            Array.isArray(selection) ? selection : [selection]
        );
    }

    onHeaderClicked(actionId: string): void {
        if (actionId === 'assign') {
            this.assignForm.reset({ coverageAreaIds: [] });
            this.facade.readUnassigned(true);
            this.displayAssignModal.set(true);
        } else if (actionId === 'reassign') {
            this.reassignForm.reset({ siteGroupId: null });
            this.displayReassignModal.set(true);
        } else if (actionId === 'remove') {
            this.removeSelected();
        }
    }

    submitAssign(): void {
        if (this.assignForm.invalid || !this.groupId()) {
            this.assignForm.markAllAsTouched();
            return;
        }
        this.facade.assign(
            this.groupId(),
            this.assignForm.getRawValue().coverageAreaIds ?? []
        );
    }

    submitReassign(): void {
        const targetId = this.reassignForm.getRawValue().siteGroupId;
        if (this.reassignForm.invalid || !targetId || !this.groupId()) {
            this.reassignForm.markAllAsTouched();
            return;
        }
        this.facade.reassign(
            this.groupId(),
            this.selectedItems().map((item) => Number(item.id)),
            targetId
        );
    }

    async removeSelected(): Promise<void> {
        const ids = this.selectedItems().map((item) => Number(item.id));
        if (!ids.length || !this.groupId()) {
            return;
        }
        const confirmed = await SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t('COMMON.REMOVE'),
            text: this.t(
                'COVERAGE_AREAS.SITE_GROUP.COVERAGE_AREAS.REMOVE_CONFIRM'
            ),
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        });
        if (confirmed.isConfirmed) {
            this.facade.remove(this.groupId(), ids);
        }
    }

    closeAssign(): void {
        this.displayAssignModal.set(false);
        this.assignForm.reset({ coverageAreaIds: [] });
    }

    closeReassign(): void {
        this.displayReassignModal.set(false);
        this.reassignForm.reset({ siteGroupId: null });
    }

    goBack(): void {
        this.router.navigate([
            COVERAGE_AREAS_ROUTE,
            SITE_GROUP_ROUTE,
            SITE_GROUP_LIST,
        ]);
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }
}
