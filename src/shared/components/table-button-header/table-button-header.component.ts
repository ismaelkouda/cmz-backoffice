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

export interface TableHeaderButton {
    label?: string;
    icon?: string;
    class?: string; // e.g. 'btn-primary', 'btn-danger'
    actionId: string; // ID to emit when clicked
    disabled?: boolean;
    hidden?: boolean;
    translateKey?: string; // Optional: specific translation key for label
}

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
                        showLabels
                            ? null
                            : labelOther || ('COMMON.CREATE' | translate)
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

            @for (btn of customButtons; track btn.actionId) {
                @if (!btn.hidden) {
                    <button
                        type="button"
                        [class.p-disabled]="btn.disabled"
                        class="btn"
                        [ngClass]="btn.class || 'btn-secondary'"
                        [attr.aria-label]="
                            showLabels
                                ? null
                                : (btn.translateKey || btn.label || ''
                                  | translate)
                        "
                        (click)="onButtonClick(btn.actionId)"
                    >
                        @if (btn.icon) {
                            <i [class]="btn.icon" [class.me-2]="showLabels"></i>
                        }
                        @if (showLabels && (btn.label || btn.translateKey)) {
                            <span>{{
                                btn.translateKey || btn.label | translate
                            }}</span>
                        }
                    </button>
                }
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
                    <i class="pi pi-refresh me-2"></i>
                    <span *ngIf="showLabels">{{
                        'COMMON.REFRESH' | translate
                    }}</span>
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
                    <i class="pi pi-file me-2"></i>
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
    @Output() buttonClick = new EventEmitter<string>();

    @Input() hiddenButtonRefresh!: boolean;
    @Input() hiddenButtonExport!: boolean;
    @Input() hiddenButtonOther!: boolean;
    @Input() labelOther!: string;
    @Input() iconOther!: string;
    @Input() colorOther: string | null = null;
    @Input() disabledButtonExport!: boolean;
    @Input() disabledButtonOther!: boolean;
    @Input() disabledButtonRefresh = false;

    @Input() customButtons: TableHeaderButton[] = [];

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

    onButtonClick(actionId: string) {
        this.buttonClick.emit(actionId);
    }

    @HostListener('window:resize')
    onResize() {
        this.updateLabelVisibility();
    }

    private updateLabelVisibility(): void {
        this.showLabels = window.innerWidth > 650;
    }
}
