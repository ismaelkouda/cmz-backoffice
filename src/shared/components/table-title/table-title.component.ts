import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { SeparatorThousandsPipe } from '@shared/pipes/separator-thousands.pipe';
import { AppCustomizationService } from '../../services/app-customization.service';

@Component({
    selector: 'app-table-title',
    standalone: true,
    imports: [CommonModule, SeparatorThousandsPipe],
    template: `
        <div style="padding: 1.2rem 0 0.8rem 0">
            <span class="table-header-wrapper">
                <b *ngIf="page">
                    <span *ngIf="label">Resultat du filtre</span>
                    <span *ngIf="!label">Total :</span>
                    <span class="text-success"> {{ (count || 0) | separatorThousandsPipe }}</span>
                    <span *ngIf="count > 0 && page && totalPage">
                        [Page
                        <span [style.color]="config.colors.primary">{{
                            page
                        }}</span>
                        / {{ totalPage }}] [{{ perPage }}]
                    </span>
                </b>
                <b *ngIf="!page">
                    <span *ngIf="label">Resultat du filtre</span>
                    <span *ngIf="!label">Total :</span>
                    <span class="text-success"> {{ (count || 0) | separatorThousandsPipe }}</span></b
                >
            </span>
        </div>
    `,
})
export class TableTitleComponent {
    public readonly config = inject(AppCustomizationService).config;

    @Input() label: boolean = true;
    @Input() count!: number;
    @Input() page!: number;
    @Input() totalPage!: number;
    @Input() perPage!: number;
    @Input() title!: string;
}
