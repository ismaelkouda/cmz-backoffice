import { Component, inject, input, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SeparatorThousandsPipe } from '@shared/domain/pipes/separator-thousands.pipe';

import { AppCustomizationService } from '../../domain/services/app-customization/app-customization.service';

@Component({
    selector: 'app-table-title',
    standalone: true,
    imports: [SeparatorThousandsPipe, TranslateModule],
    template: `
        @if (!hiddenTableTitle()) {
            <div>
                <span class="table-header-wrapper">
                    @if (page) {
                        <b>
                            @if (label) {
                                <span>{{
                                    'COMMON.FILTER_RESULT' | translate
                                }}</span>
                            }
                            @if (!label) {
                                <span>Total :</span>
                            }
                            <span class="text-success">
                                {{ count || 0 | separatorThousandsPipe }}</span
                            >
                            @if (count > 0 && page && totalPage) {
                                <span>
                                    [Page
                                    <span
                                        [style.color]="config.colors.primary"
                                        >{{ page }}</span
                                    >
                                    / {{ totalPage | separatorThousandsPipe }}]
                                    [{{ perPage }}]
                                </span>
                            }
                        </b>
                    }
                </span>
            </div>
        }
    `,
})
export class TableTitleComponent {
    public readonly config = inject(AppCustomizationService).customization;

    public readonly hiddenTableTitle = input<boolean>(false);
    @Input() label = true;
    @Input() count!: number;
    @Input() page!: number;
    @Input() totalPage!: number;
    @Input() perPage!: number;
    @Input() title!: string;
}
