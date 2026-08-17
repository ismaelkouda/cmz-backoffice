import {
    Component,
    inject,
    input,
    output,
    computed,
    ChangeDetectionStrategy,
    effect,
    signal,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HistoryFindOneFacade } from '@shared/components/history/application/services/history-find-one.facade';
import { HistoryDialogVmPresenter } from '@shared/components/history/presentation/adapters/history-dialog-vm.presenter';
import { TableComponent } from '@shared/components/table/table.component';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-history-dialog',
    standalone: true,
    imports: [
        TranslateModule,
        DialogModule,
        ButtonModule,
        SkeletonModule,
        TagModule,
        TooltipModule,
        TableComponent,
    ],
    templateUrl: './history-dialog.component.html',
    styleUrls: ['./history-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryDialogComponent {
    readonly visible = input.required<boolean>();
    readonly uniqId = input.required<string>();
    readonly typeModel = input.required<string>();
    readonly visibleChange = output();

    private readonly facade = inject(HistoryFindOneFacade);
    private readonly presenter = inject(HistoryDialogVmPresenter);
    // private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly toast = inject(ToastrService);
    private readonly translate = inject(TranslateService);

    readonly item = this.facade.items;
    readonly loading = this.facade.loading;

    readonly vm = computed(() => this.presenter.map(this.item()));

    readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.customization.app.name
    );

    private readonly loadedId = signal<string | null>(null);

    constructor() {
        effect(() => {
            const uniqId = this.uniqId();
            const typeModel = this.typeModel();
            const visible = this.visible();

            if (!visible || !uniqId) {
                return;
            }

            if (this.loadedId() === uniqId) {
                return;
            }

            this.loadedId.set(uniqId);
            this.facade.read(
                { uniqId: uniqId, typeModel: typeModel },
                {
                    forceRefresh: true,
                }
            );
        });
    }

    // public onRefreshClicked(): void {
    //     this.facade.refresh();
    // }

    // public onExportExcel(): void {
    //     const items = this.vm();
    //     if (!items.length) {
    //         this.toast.error(this.t('EXPORT.NO_DATA'));
    //         return;
    //     }

    //     this.exportService.exportAsExcelFile(
    //         items,
    //         this.tableConfig,
    //         `${this.exportFilePrefix}-actions-treatment`
    //     );
    // }

    private normalizeExportPrefix(name: string): string {
        return (
            name
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
    }

    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }

    onClose(): void {
        this.visibleChange.emit();
    }
}
