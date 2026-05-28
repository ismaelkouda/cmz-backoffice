import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
} from '@angular/core';
import { NgbDropdownModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ActionDropdown } from '@shared/domain/enums/action-dropdown.enum';

import { ActionDropdownItem } from './interfaces/action-dropdown.interface';

@Component({
    selector: 'app-action-dropdown',
    standalone: true,
    template: `
        <div ngbDropdown class="action-dropdown" container="body">
            @if (!disabled()) {
                <button
                    container="body"
                    placement="bottom"
                    type="button"
                    class="action-dropdown__trigger"
                    ngbDropdownToggle
                >
                    <span class="action-dropdown__trigger-icon">
                        {{ 'COMMON.CHOOSE' | translate }}
                    </span>
                </button>
                <div ngbDropdownMenu class="action-dropdown__menu shadow-lg">
                    @for (action of actions(); track action.id) {
                        @if (!action.hidden) {
                            <span
                                [ngbTooltip]="action.tooltip"
                                placement="bottom"
                                container="body"
                            >
                                <button
                                    ngbDropdownItem
                                    type="button"
                                    class="action-dropdown__item"
                                    container="body"
                                    placement="bottom"
                                    [disabled]="action.disabled"
                                    [ngbTooltip]="action.tooltip"
                                    (click)="onActionClicked(action)"
                                >
                                    <div class="action-dropdown__item-content">
                                        @if (action.icon) {
                                            <i
                                                class="action-dropdown__icon"
                                                [class]="action.icon"
                                            ></i>
                                        }

                                        <span class="action-dropdown__label">
                                            {{ action.label | translate }}
                                        </span>
                                    </div>
                                </button>
                            </span>
                        }
                    }
                </div>
            } @else {
                <span
                    [ngbTooltip]="tooltip()"
                    placement="bottom"
                    container="body"
                >
                    <button
                        [disabled]="!disabled()"
                        [ngbTooltip]="tooltip()"
                        container="body"
                        placement="bottom"
                        type="button"
                        class="action-dropdown__trigger"
                        ngbDropdownToggle
                    >
                        <span class="action-dropdown__trigger-icon">
                            {{ 'COMMON.CHOOSE' | translate }}
                        </span>
                    </button>
                </span>
            }
        </div>
    `,
    styles: [
        `
            .action-dropdown {
                display: inline-flex;
                position: relative;
            }

            .action-dropdown__trigger {
                background: var(--theme-default);
                border: 1px solid var(--theme-default);
                border-radius: 6px;
                color: #ffffff;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;

                &:hover:not(:disabled) {
                    background: color-mix(
                        in srgb,
                        var(--theme-default) 30%,
                        transparent
                    );
                    border-color: color-mix(
                        in srgb,
                        var(--theme-default) 30%,
                        transparent
                    );
                    color: #ffffff;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px var(--theme-default);
                }

                &:active:not(:disabled) {
                    background: color-mix(
                        in srgb,
                        var(--theme-default) 70%,
                        transparent
                    );
                    border-color: color-mix(
                        in srgb,
                        var(--theme-default) 70%,
                        transparent
                    );
                    transform: translateY(0);
                    box-shadow: inset 0 2px 4px var(--theme-default);
                }

                &:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px var(--theme-default);
                }

                &:disabled {
                    background: color-mix(
                        in srgb,
                        var(--theme-default) 45%,
                        white 55%
                    );
                    border-color: color-mix(
                        in srgb,
                        var(--theme-default) 45%,
                        white 55%
                    );
                    color: color-mix(
                        in srgb,
                        var(--theme-default) 80%,
                        white 20%
                    );
                    cursor: not-allowed;
                    opacity: 0.7;
                }
            }

            .action-dropdown__trigger-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
            }

            .action-dropdown__menu {
                background: var(--surface-card, #ffffff);
                border: 1px solid var(--surface-border, #e0e0e0);
                border-radius: 8px;
                padding: 0.5rem;
                min-width: 200px;
                animation: fadeIn 0.2s ease-out;
                z-index: 1060;

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            }

            .action-dropdown__item {
                background: transparent;
                border: none;
                border-radius: 6px;
                color: var(--text-color, #212529);
                cursor: pointer;
                padding: 0.625rem 0.875rem;
                text-align: left;
                width: 100%;
                transition: all 0.15s ease;
                margin: 0.125rem 0;

                &:hover {
                    color: var(--color-white);
                    background-color: color-mix(
                        in srgb,
                        var(--theme-secondary) 73%,
                        white 27%
                    );
                }

                &:active {
                    background-color: var(--surface-active, #e9ecef);
                    transform: translateX(0);
                }

                &:focus {
                    outline: none;
                    box-shadow: inset 0 0 0 2px var(--color-default);
                }

                &:disabled {
                    color: var(--text-disabled, #6c757d);
                    cursor: not-allowed;
                    background: transparent;
                }
            }

            .action-dropdown__item--danger {
                &:hover {
                    background-color: rgba(220, 53, 69, 0.1);
                    color: var(--red-600, #dc3545);
                }

                &:active {
                    background-color: rgba(220, 53, 69, 0.15);
                }
            }

            .action-dropdown__item-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .action-dropdown__icon {
                font-size: 1rem;
                width: 16px;
                text-align: center;

                &--view {
                    color: var(--blue-500, #0d6efd);
                }

                &--edit {
                    color: var(--amber-500, #ffc107);
                }

                &--enable {
                    color: var(--green-500, #198754);
                }

                &--disable {
                    color: var(--orange-500, #fd7e14);
                }

                &--danger {
                    color: var(--red-500, #dc3545);
                }
            }

            .action-dropdown__label {
                font-size: 0.875rem;
                font-weight: 500;
                flex: 1;
            }

            .action-dropdown__separator {
                height: 1px;
                background-color: var(--surface-border, #e0e0e0);
                margin: 0.5rem 0;
                opacity: 0.6;
            }

            :host-context(.table-row:hover) .action-dropdown__trigger {
                background: var(--theme-default-hover, #2563eb);
                border-color: var(--theme-default-hover, #2563eb);
            }

            @media (prefers-color-scheme: dark) {
                .action-dropdown__menu {
                    background: var(--surface-900, #1a1a1a);
                    border-color: var(--surface-700, #2d3748);
                }

                .action-dropdown__item {
                    color: var(--surface-100, #e2e8f0);

                    &:hover {
                        background-color: var(--surface-800, #2d3748);
                    }
                }

                .action-dropdown__separator {
                    background-color: var(--surface-700, #2d3748);
                }
            }

            @media (max-width: 768px) {
                .action-dropdown__menu {
                    min-width: 180px;
                }

                .action-dropdown__item-content {
                    gap: 0.5rem;
                }
            }
        `,
    ],
    imports: [TranslateModule, NgbDropdownModule, NgbTooltip],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionDropdownComponent {
    readonly disabled = input(false);
    readonly tooltip = input<string>();

    readonly actions = input<ActionDropdownItem<any>[]>([]);

    readonly actionClicked = output<ActionDropdownItem<any>>();

    protected onActionClicked(action: ActionDropdownItem<any>): void {
        if (action.disabled) {
            return;
        }

        this.actionClicked.emit(action);
    }

    // protected readonly disabled = input<boolean>();
    // protected readonly tooltip = input<string>();

    protected readonly hiddenDelete = input<boolean>();
    protected readonly disableDelete = input<boolean>();
    protected readonly tooltipDelete = input<string>();

    protected readonly hiddenEdit = input<boolean>();
    protected readonly disableEdit = input<boolean>();
    protected readonly tooltipEdit = input<string>();

    protected readonly hiddenEnable = input<boolean>();
    protected readonly disableEnable = input<boolean>();
    protected readonly tooltipEnable = input<string>();

    protected readonly hiddenDisable = input<boolean>();
    protected readonly disableDisable = input<boolean>();
    protected readonly tooltipDisable = input<string>();

    public readonly status = input.required<ActionDropdown>();
    public readonly actionDropdown = ActionDropdown;

    public readonly edit = output<undefined>();
    public readonly view = output<undefined>();
    public readonly enable = output<undefined>();
    public readonly disable = output<undefined>();
    public readonly delete = output<undefined>();

    onEdit(): void {
        this.edit.emit(undefined);
    }

    onView(): void {
        this.view.emit(undefined);
    }

    onEnable(): void {
        this.enable.emit(undefined);
    }

    onDisable(): void {
        this.disable.emit(undefined);
    }

    onDelete(): void {
        this.delete.emit(undefined);
    }
}
