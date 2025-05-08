import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit,
    HostListener,
} from '@angular/core';

@Component({
    selector: 'app-table-button-header',
    styles: [
        `
            .margin-right-5 {
                margin-right: 5px;
            }
        `,
    ],
    template: `
        <div>
            <p-button
                *ngIf="!hiddenButtonOther"
                [class.p-disabled]="disabledButtonOther"
                [label]="showLabels ? labelOther : ''"
                icon="pi pi-refresh"
                [styleClass]="'p-button-' + colorOther"
                class="margin-right-5"
                (click)="onOther()"
            >
            </p-button>
            <p-button
                *ngIf="!hiddenButtonRefresh"
                [label]="showLabels ? ('REFRESH' | translate) : ''"
                icon="pi pi-refresh"
                styleClass="p-button-secondary"
                class="margin-right-5"
                (click)="onRefresh()"
            >
            </p-button>
            <p-button
                *ngIf="!hiddenButtonExport"
                [class.p-disabled]="disabledButtonExport"
                [label]="showLabels ? ('EXPORT' | translate) : ''"
                icon="pi pi-download"
                styleClass="p-button-success"
                (click)="onExport()"
            >
            </p-button>
        </div>
    `,
})
export class TablebuttonHeaderComponent implements OnInit {
    public showLabels: boolean;
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
    @Input() disabledButtonOther: boolean;

    ngOnInit(): void {
        this.updateLabelVisibility();
    }

    onRefresh() {
        this.refresh.emit();
    }

    onExport() {
        this.export.emit();
    }

    onOther() {
        this.other.emit();
    }

    @HostListener('window:resize')
    onResize() {
        this.updateLabelVisibility();
    }

    private updateLabelVisibility(): void {
        this.showLabels = window.innerWidth > 650;
    }
}
