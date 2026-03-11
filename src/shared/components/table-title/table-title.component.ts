import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SeparatorThousandsPipe } from '@shared/domain/pipes/separator-thousands.pipe';

import { AppCustomizationService } from '../../domain/services/app-customization.service';

@Component({
    selector: 'app-table-title',
    standalone: true,
    imports: [CommonModule, SeparatorThousandsPipe, TranslateModule],
    template: `
        <div>
            <span class="table-header-wrapper">
                <b *ngIf="page">
                    <span *ngIf="label">{{
                        'COMMON.FILTER_RESULT' | translate
                    }}</span>
                    <span *ngIf="!label">Total :</span>
                    <span class="text-success">
                        {{ count || 0 | separatorThousandsPipe }}</span
                    >
                    <span *ngIf="count > 0 && page && totalPage">
                        [Page
                        <span [style.color]="config.colors.primary">{{
                            page
                        }}</span>
                        / {{ totalPage | separatorThousandsPipe }}] [{{
                            perPage
                        }}]
                    </span>
                </b>
                <b *ngIf="!page">
                    <span *ngIf="label">{{
                        'COMMON.FILTER_RESULT' | translate
                    }}</span>
                    <span *ngIf="!label">Total :</span>
                    <span class="text-success">
                        {{ count || 0 | separatorThousandsPipe }}</span
                    ></b
                >
            </span>
        </div>
    `,
})
export class TableTitleComponent {
    public readonly config = inject(AppCustomizationService).config;

    @Input() label = true;
    @Input() count!: number;
    @Input() page!: number;
    @Input() totalPage!: number;
    @Input() perPage!: number;
    @Input() title!: string;
}
