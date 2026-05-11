import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    input,
    OnInit,
    output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';

export interface TableHeaderButton {
    label?: string;
    icon?: string;
    class?: string;
    type?: string;
    actionId: string;
    disabled?: boolean;
    hidden?: boolean;
    translateKey?: string;
    items?: MenuItem[];
}

@Component({
    selector: 'app-table-button-header',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TranslateModule,
        MenuModule,
        TooltipModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
            .table-button-header {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
            }

            .pi.pi-plus {
                font-size: inherit !important;
            }
        `,
    ],
    template: `
        <div class="table-button-header">
            @for (btn of customButtons(); track btn.actionId) {
                @if (btn.items?.length) {
                    <p-menu
                        #menu
                        [model]="btn.items"
                        [popup]="true"
                        appendTo="body"
                    />

                    <button
                        type="button"
                        [disabled]="btn.disabled"
                        class="btn"
                        [ngClass]="btn.class || 'btn-primary'"
                        [attr.aria-label]="
                            showLabels
                                ? null
                                : (btn.translateKey || btn.label || ''
                                  | translate)
                        "
                        (click)="menu.toggle($event)"
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
                } @else {
                    <span [pTooltip]="btn.tooltip" tooltipPosition="bottom">
                        <button
                            type="button"
                            [disabled]="btn.disabled"
                            class="btn"
                            [ngClass]="btn.class || 'btn-secondary'"
                            [pTooltip]="btn.tooltip"
                            tooltipPosition="bottom"
                            (click)="onButtonClick(btn.actionId)"
                        >
                            @if (btn.icon) {
                                <i
                                    [class]="btn.icon"
                                    [class.me-2]="showLabels"
                                ></i>
                            }
                            @if (
                                showLabels && (btn.label || btn.translateKey)
                            ) {
                                <span>{{
                                    btn.translateKey || btn.label | translate
                                }}</span>
                            }
                        </button>
                    </span>
                }
            }
        </div>
    `,
})
export class TableButtonHeaderComponent implements OnInit {
    public showLabels!: boolean;
    readonly refresh = output();
    readonly export = output();
    readonly other = output();
    readonly buttonClick = output<string>();

    readonly hiddenButtonRefresh = input<boolean>(false);
    readonly hiddenButtonExport = input<boolean>(false);
    readonly hiddenButtonOther = input<boolean>(false);
    readonly labelOther = input<string>('');
    readonly iconOther = input<string>('');
    readonly colorOther = input<string>('');
    readonly disabledButtonExport = input<boolean>(false);
    readonly disabledButtonOther = input<boolean>(true);
    readonly disabledButtonRefresh = input<boolean>(false);

    readonly customButtons = input<TableHeaderButton[]>();

    get otherButtonStyleClass(): string {
        return this.colorOther()
            ? `p-button-${this.colorOther()}`
            : 'p-button-help';
    }

    ngOnInit(): void {
        this.updateLabelVisibility();
    }

    onRefresh(): void {
        this.refresh.emit();
    }

    onExport(): void {
        this.export.emit();
    }

    onOther(): void {
        this.other.emit();
    }

    onButtonClick(actionId: string): void {
        this.buttonClick.emit(actionId);
    }

    @HostListener('window:resize')
    onResize(): void {
        this.updateLabelVisibility();
    }

    private updateLabelVisibility(): void {
        this.showLabels = window.innerWidth > 650;
    }
}
