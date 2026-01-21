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
            @if (!hiddenButtonOther) {
                <button
                    type="button"
                    [class.p-disabled]="disabledButtonOther"
                    [styleClass]="otherButtonStyleClass"
                    class="btn btn-primary"
                    [attr.aria-label]="
                        showLabels ? null : labelOther || ('CREATE' | translate)
                    "
                    (click)="onOther()"
                >
                    @if (labelOther) {
                        <span>{{ labelOther | translate }}</span>
                    } @else {
                        <span>{{ 'COMMON.CREATE' | translate }}</span>
                    }
                </button>
            }
            @if (!hiddenButtonRefresh) {
                <button
                    type="button"
                    [class.p-disabled]="disabledButtonRefresh"
                    class="btn btn-dark"
                    [attr.aria-label]="
                        showLabels ? null : ('COMMON.REFRESH' | translate)
                    "
                    (click)="onRefresh()"
                >
                    <span *ngIf="showLabels">{{ 'COMMON.REFRESH' | translate }}</span>
                </button>
            }
            @if (!hiddenButtonExport) {
                <button
                    type="button"
                    [class.p-disabled]="disabledButtonExport"
                    class="btn btn-success"
                    [attr.aria-label]="
                        showLabels ? null : ('COMMON.EXPORT' | translate)
                    "
                    (click)="onExport()"
                >
                    <span *ngIf="showLabels">{{
                        'COMMON.EXPORT' | translate
                    }}</span>
                </button>
            }
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
