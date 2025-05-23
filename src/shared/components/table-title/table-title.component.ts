import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-table-title',
    template: `
        <div style="padding: 1.2rem 0 0.8rem 0">
            <span class="table-header-wrapper">
                <b *ngIf="page">
                    <span *ngIf="label">Resultat du filtre</span>
                    <span *ngIf="!label">Total</span>
                    <span class="text-success"> {{ count || 0 }}</span>
                    <span *ngIf="count > 0 && page && totalPage">
                        [Page <span style="color: #ff6600;">{{ page }}</span> /
                        {{ totalPage }}] [{{ perPage }}]
                    </span>
                </b>
                <b *ngIf="!page">
                    <span *ngIf="label">Resultat du filtre</span>
                    <span *ngIf="!label">Total</span>
                    <span class="text-success"> {{ count || 0 }}</span></b
                >
            </span>
        </div>
    `,
})
export class TableTitleComponent {
    @Input() label: boolean = true;
    @Input() count: number;
    @Input() page: number;
    @Input() totalPage: number;
    @Input() perPage: number;
    @Input() legendeSingulier: string;
    @Input() legendePluriel: string;
}
