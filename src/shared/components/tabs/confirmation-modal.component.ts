import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-confirmation-modal',
    template: `
        <div
            class="modal-backdrop"
            *ngIf="isOpen"
            (click)="onBackdropClick($event)"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ title }}</h5>
                        <button
                            type="button"
                            class="close-button"
                            (click)="onCancel()"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="message-container">
                            <div class="icon-container">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line
                                        x1="12"
                                        y1="16"
                                        x2="12.01"
                                        y2="16"
                                    ></line>
                                </svg>
                            </div>
                            <p>{{ message }}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-cancel"
                            (click)="onCancel()"
                        >
                            {{ cancelText }}
                        </button>
                        <button
                            type="button"
                            class="btn btn-confirm"
                            (click)="onConfirm()"
                        >
                            {{ confirmText }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(15, 23, 42, 0.4);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1050;
                animation: fadeIn 0.25s ease;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            .modal-dialog {
                width: 100%;
                max-width: 420px;
                margin: 30px auto;
                animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }

            @keyframes slideIn {
                from {
                    transform: translateY(-20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            .modal-content {
                position: relative;
                display: flex;
                flex-direction: column;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
                    0 8px 10px -6px rgba(0, 0, 0, 0.05);
                overflow: hidden;
                border: none;
            }

            .modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 24px;
                border-bottom: 1px solid rgba(226, 232, 240, 0.8);
            }

            .modal-title {
                margin: 0;
                font-size: 18px;
                color: #5b9bd5;
                font-weight: 600;
                letter-spacing: -0.01em;
            }

            .close-button {
                background: transparent;
                border: none;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                color: #64748b;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .close-button:hover {
                background-color: #f1f5f9;
                color: #334155;
            }

            .modal-body {
                padding: 24px;
                color: #475569;
            }

            .message-container {
                display: flex;
                align-items: flex-start;
                gap: 16px;
            }

            .icon-container {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                background-color: #f8fafc;
                border-radius: 50%;
                color: #3b82f6;
                flex-shrink: 0;
                margin-top: 2px;
            }

            .modal-body p {
                margin: 0;
                font-size: 15px;
                line-height: 1.6;
            }

            .modal-footer {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding: 16px 24px 20px;
                gap: 12px;
                border-top: none;
            }

            .btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-weight: 500;
                text-align: center;
                vertical-align: middle;
                cursor: pointer;
                border: 1px solid transparent;
                padding: 10px 16px;
                font-size: 14px;
                line-height: 1.5;
                border-radius: 8px;
                transition: all 0.2s ease;
                letter-spacing: -0.01em;
                height: 40px;
                min-width: 100px;
            }

            .btn-cancel {
                color: #475569;
                background-color: #f1f5f9;
                border-color: transparent;
            }

            .btn-cancel:hover {
                background-color: #e2e8f0;
                color: #334155;
            }

            .btn-confirm {
                color: #ffffff;
                background-color: #ef4444;
                border-color: transparent;
            }

            .btn-confirm:hover {
                background-color: #dc2626;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            }

            .btn-confirm:active {
                background-color: #b91c1c;
            }
        `,
    ],
})
export class ConfirmationModalComponent {
    @Input() isOpen: boolean = false;
    @Input() title: string = 'Confirmation';
    @Input() message: string =
        'Êtes-vous sûr de vouloir effectuer cette action?';
    @Input() confirmText: string = 'Confirmer';
    @Input() cancelText: string = 'Annuler';

    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    onConfirm(): void {
        this.confirm.emit();
        this.isOpen = false;
    }

    onCancel(): void {
        this.cancel.emit();
        this.isOpen = false;
    }

    onBackdropClick(event: MouseEvent): void {
        // Si le clic est sur l'arrière-plan et non sur le contenu du modal
        if (
            (event.target as HTMLElement).classList.contains('modal-backdrop')
        ) {
            this.onCancel();
        }
    }
}
