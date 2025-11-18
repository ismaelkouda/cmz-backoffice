import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-table-button-header',
    standalone: true,
    imports: [CommonModule, ButtonModule, TranslateModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
            .table-button-header {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
            }
        `,
    ],
    template: `
        <div class="table-button-header">
            <p-button
                *ngIf="!hiddenButtonOther"
                [class.p-disabled]="disabledButtonOther"
                [label]="
                    showLabels
                        ? (labelOther | translate) || ('CREATE' | translate)
                        : ''
                "
                [styleClass]="otherButtonStyleClass"
                [attr.aria-label]="
                    showLabels ? null : labelOther || ('CREATE' | translate)
                "
                (click)="onOther()"
            />
            <p-button
                *ngIf="!hiddenButtonRefresh"
                [class.p-disabled]="disabledButtonRefresh"
                [label]="showLabels ? ('REFRESH' | translate) : ''"
                styleClass="p-button-secondary"
                [attr.aria-label]="showLabels ? null : ('REFRESH' | translate)"
                (click)="onRefresh()"
            />
            <p-button
                *ngIf="!hiddenButtonExport"
                [class.p-disabled]="disabledButtonExport"
                [label]="showLabels ? ('EXPORT.TITLE' | translate) : ''"
                styleClass="p-button-success"
                [attr.aria-label]="
                    showLabels ? null : ('EXPORT.TITLE' | translate)
                "
                (click)="onExport()"
            />
        </div>
    `,
})
export class TableButtonHeaderComponent implements OnInit {
    public showLabels!: boolean;
    @Output() refresh = new EventEmitter<void>();
    @Output() export = new EventEmitter<void>();
    @Output() other = new EventEmitter<void>();
    @Input() hiddenButtonRefresh!: boolean;
    @Input() hiddenButtonExport!: boolean;
    @Input() hiddenButtonOther!: boolean;
    @Input() labelOther!: string;
    @Input() iconOther!: string;
    @Input() colorOther: string | null = null;
    @Input() disabledButtonExport!: boolean;
    @Input() disabledButtonOther!: boolean;
    @Input() disabledButtonRefresh = false;

    get otherButtonStyleClass(): string {
        return this.colorOther
            ? `p-button-${this.colorOther}`
            : 'p-button-help';
    }

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
