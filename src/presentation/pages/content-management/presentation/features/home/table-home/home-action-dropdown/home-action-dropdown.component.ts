import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
} from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ActionDropdown } from '@shared/domain/enums/action-dropdown.enum';

@Component({
    selector: 'app-home-action-dropdown',
    standalone: true,
    template: `
        <div ngbDropdown class="action-dropdown" container="body">
            <button
                type="button"
                class="action-dropdown__trigger"
                ngbDropdownToggle
                [attr.aria-label]="'COMMON.ACTIONS' | translate"
                [title]="'COMMON.ACTIONS' | translate"
            >
                <span class="action-dropdown__trigger-icon">
                    {{ 'COMMON.CHOOSE' | translate }}
                </span>
            </button>

            <div
                ngbDropdownMenu
                class="action-dropdown__menu shadow-lg"
                [attr.aria-label]="'COMMON.ACTIONS_MENU' | translate"
            >
                <!-- Vue -->
                <!--<button
          ngbDropdownItem 
          class="action-dropdown__item"
          (click)="onView()"
          [attr.aria-label]="'COMMON.VIEW_ITEM' | translate"
        >
          <div class="action-dropdown__item-content">
            <i class="pi pi-eye action-dropdown__icon action-dropdown__icon--view"></i>
            <span class="action-dropdown__label">{{ 'COMMON.DETAILS' | translate }}</span>
          </div>
        </button>-->

                <!-- Édition -->
                <button
                    ngbDropdownItem
                    class="action-dropdown__item"
                    (click)="onEdit()"
                    [attr.aria-label]="'COMMON.EDIT_ITEM' | translate"
                >
                    <div class="action-dropdown__item-content">
                        <i
                            class="pi pi-pencil action-dropdown__icon action-dropdown__icon--edit"
                        ></i>
                        <span class="action-dropdown__label">{{
                            'COMMON.EDIT' | translate
                        }}</span>
                    </div>
                </button>

                <!-- Activation/Désactivation -->
                @if (status() === actionDropdown.INACTIVE) {
                    <button
                        ngbDropdownItem
                        class="action-dropdown__item"
                        (click)="onEnable()"
                        [attr.aria-label]="'COMMON.ENABLE_ITEM' | translate"
                    >
                        <div class="action-dropdown__item-content">
                            <i
                                class="pi pi-check action-dropdown__icon action-dropdown__icon--enable"
                            ></i>
                            <span class="action-dropdown__label">
                                {{ 'COMMON.ENABLE' | translate }}</span
                            >
                        </div>
                    </button>
                }

                <!-- Activation/Désactivation -->
                @if (status() === actionDropdown.UNPUBLISHED) {
                    <button
                        ngbDropdownItem
                        class="action-dropdown__item"
                        (click)="onEnable()"
                        [attr.aria-label]="'COMMON.PUBLISH_ITEM' | translate"
                    >
                        <div class="action-dropdown__item-content">
                            <i
                                class="pi pi-check action-dropdown__icon action-dropdown__icon--enable"
                            ></i>
                            <span class="action-dropdown__label">
                                {{ 'COMMON.PUBLISH' | translate }}</span
                            >
                        </div>
                    </button>
                }

                @if (status() === actionDropdown.ACTIVE) {
                    <button
                        ngbDropdownItem
                        class="action-dropdown__item"
                        (click)="onDisable()"
                        [attr.aria-label]="'COMMON.DISABLE_ITEM' | translate"
                    >
                        <div class="action-dropdown__item-content">
                            <i
                                class="pi pi-times action-dropdown__icon action-dropdown__icon--disable"
                            ></i>
                            <span class="action-dropdown__label">{{
                                'COMMON.DISABLE' | translate
                            }}</span>
                        </div>
                    </button>
                }

                @if (status() === actionDropdown.PUBLISHED) {
                    <button
                        ngbDropdownItem
                        class="action-dropdown__item"
                        (click)="onDisable()"
                        [attr.aria-label]="'COMMON.UNPUBLISH_ITEM' | translate"
                    >
                        <div class="action-dropdown__item-content">
                            <i
                                class="pi pi-times action-dropdown__icon action-dropdown__icon--disable"
                            ></i>
                            <span class="action-dropdown__label">{{
                                'COMMON.UNPUBLISH' | translate
                            }}</span>
                        </div>
                    </button>
                }

                <!-- Séparateur -->
                <div class="action-dropdown__separator"></div>

                <!-- Suppression -->
                <button
                    ngbDropdownItem
                    class="action-dropdown__item action-dropdown__item--danger"
                    (click)="onDelete()"
                    [attr.aria-label]="'COMMON.DELETE_ITEM' | translate"
                >
                    <div class="action-dropdown__item-content">
                        <i
                            class="pi pi-trash action-dropdown__icon action-dropdown__icon--danger"
                        ></i>
                        <span class="action-dropdown__label">{{
                            'COMMON.DELETE' | translate
                        }}</span>
                    </div>
                </button>
            </div>
        </div>
    `,
    styles: [
        `
            /* Container principal */
            .action-dropdown {
                display: inline-flex;
                position: relative;
            }

            .action-dropdown__trigger {
                background: var(--theme-default, #3b82f6);
                border: 1px solid var(--theme-default, #3b82f6);
                border-radius: 6px;
                color: #ffffff;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;

                &:hover:not(:disabled) {
                    background: var(--theme-default-hover, #2563eb);
                    border-color: var(--theme-default-hover, #2563eb);
                    color: #ffffff;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
                }

                &:active:not(:disabled) {
                    background: var(--theme-default-active, #1d4ed8);
                    border-color: var(--theme-default-active, #1d4ed8);
                    transform: translateY(0);
                    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                &:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    background: var(--theme-default-disabled, #93c5fd);
                    border-color: var(--theme-default-disabled, #93c5fd);
                }

                &:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
                }
            }

            .action-dropdown__trigger-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
            }

            /* Menu dropdown */
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

            /* Éléments du menu */
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
                    background-color: var(--surface-hover, #f8f9fa);
                    color: var(--primary-color, #3b82f6);
                    transform: translateX(2px);
                }

                &:active {
                    background-color: var(--surface-active, #e9ecef);
                    transform: translateX(0);
                }

                &:focus {
                    outline: none;
                    box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.2);
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

            /* Séparateur */
            .action-dropdown__separator {
                height: 1px;
                background-color: var(--surface-border, #e0e0e0);
                margin: 0.5rem 0;
                opacity: 0.6;
            }

            /* États d'interaction */
            :host-context(.table-row:hover) .action-dropdown__trigger {
                background: var(--theme-default-hover, #2563eb);
                border-color: var(--theme-default-hover, #2563eb);
            }

            /* Support mode sombre */
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

            /* Responsive */
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
    imports: [CommonModule, TranslateModule, NgbDropdownModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeActionDropdownComponent {
    public readonly status = input.required<ActionDropdown>();
    public readonly actionDropdown = ActionDropdown;

    public readonly edit = output<void>();
    public readonly view = output<void>();
    public readonly enable = output<void>();
    public readonly disable = output<void>();
    public readonly delete = output<void>();

    onEdit(): void {
        this.edit.emit();
    }

    onView(): void {
        this.view.emit();
    }

    onEnable(): void {
        this.enable.emit();
    }

    onDisable(): void {
        this.disable.emit();
    }

    onDelete(): void {
        this.delete.emit();
    }
}
