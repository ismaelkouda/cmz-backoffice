import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'app-table-button-header',
    styles: [`.margin-right-5 { margin-right: 5px; }`],
    template: `
        <div>
            <button *ngIf="!hiddenButtonOther" (click)="onOther()" pButton pRipple [label]="labelOther" [icon]="iconOther"
                [class]="'p-button-'+colorOther+' margin-right-5'"></button>
            <button *ngIf="!hiddenButtonRefresh" (click)="onRefresh()" pButton pRipple label="Rafraîchir" icon="pi pi-refresh"
                class="p-button-secondary margin-right-5"></button>
            <button *ngIf="!hiddenButtonExport" [disabled]="disabledButtonExport" (click)="onExport()" pButton pRipple label="Exporter" icon="pi pi-download"
                class="p-button-helf"></button>
        </div>
    `
})

export class TablebuttonHeaderComponent {
    @Output() refresh = new EventEmitter<void>();
    @Output() export = new EventEmitter<void>();
    @Output() other = new EventEmitter<void>();
    @Input() hiddenButtonRefresh: boolean;
    @Input() hiddenButtonExport: boolean;
    @Input() hiddenButtonOther: boolean;
    @Input() labelOther: string;
    @Input() iconOther: string;
    @Input() colorOther: string;
    @Input() disabledButtonExport: boolean;

    onRefresh() {
        this.refresh.emit();
    }

    onExport() {
        this.export.emit();
    }

    onOther() {
        this.other.emit();
    }
}