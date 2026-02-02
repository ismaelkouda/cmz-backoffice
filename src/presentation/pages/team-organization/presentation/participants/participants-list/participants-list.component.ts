import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import SweetAlert from 'sweetalert2';

import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { CrudFormType } from '@shared/domain/utils/crud-form-utils';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/services/table-export-excel-file.service';

import { ParticipantsFacade } from '@presentation/pages/team-organization/application/services/participants/participants.facade';
import { PARTICIPANTS_TABLE_CONSTANT } from '@presentation/pages/team-organization/domain/constants/participants/participants-table.constant';
import { ParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants.entity';
import { PARTICIPANTS_FORM } from '@presentation/pages/team-organization/presentation/participants/participants.routes';

@Component({
    selector: 'app-participants-list',
    standalone: true,
    imports: [
        CommonModule,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './participants-list.component.html',
    styleUrls: ['./participants-list.component.scss'],
})
export class ParticipantsListComponent implements OnInit {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    public readonly facade = inject(ParticipantsFacade);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly toastr = inject(ToastrService);
    private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    public readonly tableConfig = PARTICIPANTS_TABLE_CONSTANT;
    private readonly destroy$ = new Subject<void>();
    private readonly tableExportExcelFileService = inject(
        TableExportExcelFileService
    );

    readonly items = toSignal(this.facade.items$, { initialValue: [] });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: {} as Paginate<ParticipantsEntity>,
    });
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.config.app.name
    );

    constructor() {
        this.facade.readAll();
    }

    ngOnInit(): void {
        this.title.setTitle(
            this.t('TEAM_ORGANIZATION.PARTICIPANTS.PAGE_TITLE')
        );

        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.title.setTitle(
                    this.t('TEAM_ORGANIZATION.PARTICIPANTS.PAGE_TITLE')
                );
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onPageChangeClicked(event: number): void {
        this.facade.changePage(event + 1);
    }

    public onRefreshClicked(): void {
        this.facade.refresh();
    }

    public onCreateClicked({ ref }: { ref: CrudFormType }): void {
        this.router.navigate([PARTICIPANTS_FORM], {
            relativeTo: this.activatedRoute,
            queryParams: {
                ref: ref,
            },
        });
    }

    public onNavigateToForm(event: {
        item?: ParticipantsEntity;
        ref: CrudFormType;
    }) {
        const queryParams: any = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate([PARTICIPANTS_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    public onDeleteClicked(item: ParticipantsEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.TITLE_DELETE'
            ),
            text: `${this.t('TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.MESSAGE_DELETE')}`,
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade
                    .delete(item.uniqId)
                    .subscribe(() =>
                        this.facade.refreshWithLastFilterAndPage()
                    );
            }
        });
    }

    public onEnableClicked(item: ParticipantsEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.TITLE_ENABLE'
            ),
            text: `${this.t('TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.MESSAGE_ENABLE')}`,
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade
                    .enable(item.uniqId)
                    .subscribe(() =>
                        this.facade.refreshWithLastFilterAndPage()
                    );
            }
        });
    }

    public onDisableClicked(item: ParticipantsEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.TITLE_DISABLE'
            ),
            text: `${this.t('TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.MESSAGE_DISABLE')}`,
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade
                    .disable(item.uniqId)
                    .subscribe(() =>
                        this.facade.refreshWithLastFilterAndPage()
                    );
            }
        });
    }

    public onExportExcel(): void {
        const items = this.items();
        if (!items.length) {
            this.toastr.error(this.t('EXPORT.NO_DATA'));
            return;
        }

        this.exportService.exportAsExcelFile(
            items,
            this.tableConfig,
            `${this.exportFilePrefix}-participants`
        );
    }

    private t(key: string) {
        return this.translate.instant(key);
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
