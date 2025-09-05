import {
    Component,
    OnInit,
    ElementRef,
    ViewChild,
    AfterViewInit,
    HostListener,
} from '@angular/core';
import { TabService } from '../../services/tab.service';
import { EncodingDataService } from '../../services/encoding-data.service';

@Component({
    selector: 'app-tabs',
    template: `
        <div class="tabs-container">
            <div
                class="tabs-wrapper d-flex justify-content-between align-items-center"
            >
                <ul class="nav nav-tabs premium-tabs" #tabsContainer>
                    <li
                        class="nav-item cursor-pointer"
                        *ngFor="let tab of tabs"
                        [class.single-tab]="tabs.length === 1"
                    >
                        <a
                            class="nav-link"
                            [class.active]="tab.active"
                            (click)="activateTab(tab.id)"
                        >
                            <div class="tab-content">
                                <i
                                    *ngIf="tab.icon"
                                    class="me-2"
                                    [class]="tab.icon"
                                ></i>
                                <span class="tab-title">{{ tab.title }}</span>
                            </div>
                            <span
                                class="close-tab"
                                *ngIf="tab.closable"
                                (click)="closeTab(tab.id, $event)"
                            >
                                &times;
                            </span>
                        </a>
                    </li>
                </ul>
                <div class="tabs-actions" *ngIf="tabs.length > 1">
                    <button
                        class="btn close-all-tabs"
                        title="Fermer tous les onglets (sauf Tableau de bord)"
                        (click)="showCloseAllModal()"
                    >
                        <i class="fa fa-times"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal de confirmation -->
        <app-confirmation-modal
            [isOpen]="isModalOpen"
            [title]="'CLOSE_TABS' | translate"
            [message]="'CONFIRM_CLOSE_TABS' | translate"
            [confirmText]="'CONFIRM' | translate"
            [cancelText]="'CANCEL' | translate"
            (confirm)="confirmCloseAllTabs()"
            (cancel)="cancelCloseAllTabs()"
        >
        </app-confirmation-modal>
    `,
    styles: [
        `
            .premium-tabs {
                backdrop-filter: blur(8px);
                background: rgba(255, 255, 255, 0.75);
                border: none;
                border-radius: 0.75rem 0.75rem 0 0;

                .nav-item {
                    transition: all 0.3s ease;
                    cursor: pointer;
                    padding: 0.2rem 0.2rem;
                }

                .nav-link {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-right: 4px;
                    border: none;
                    border-radius: 0.65rem 0.65rem 0 0;
                    color: #555;
                    background: rgba(245, 247, 250, 0.9);
                    font-weight: 500;
                    transition: all 0.3s ease;
                    box-shadow: inset 0 -1px 2px rgba(0, 0, 0, 0.05);

                    &:hover {
                        background: rgba(240, 242, 246, 1);
                        color: #0d6efd;
                    }

                    &.active {
                        background: #fff;
                        color: #0d6efd;
                        font-weight: 600;
                        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
                        z-index: 2;
                        transform: translateY(-1px);
                    }

                    .tab-title {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        font-size: 0.92rem;
                    }
                }

                .close-tab {
                    margin-left: 8px;
                    font-size: 1.2rem;
                    color: #888;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;

                    &:hover {
                        background: rgba(220, 53, 69, 0.15);
                        color: #dc3545;
                        transform: scale(1.1);
                    }
                }
            }

            .tabs-actions {
                margin-left: 12px;
                .close-all-tabs {
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 0.5rem;
                    border: 1px solid #e0e0e0;
                    padding: 0.35rem 0.75rem;
                    color: #666;
                    transition: all 0.2s ease;

                    &:hover {
                        background: #fff;
                        border-color: #dc3545;
                        color: #dc3545;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
                    }
                }
            }
        `,
    ],
})
export class TabsComponent implements OnInit, AfterViewInit {
    tabs: any[] = [];
    isModalOpen: boolean = false;

    @ViewChild('tabsContainer') tabsContainer!: ElementRef;

    constructor(
        private tabService: TabService,
        private el: ElementRef,
        private encodingService: EncodingDataService
    ) {}

    ngOnInit(): void {
        console.log('tabs', this.tabs);

        this.tabService.tabs$.subscribe((tabs) => {
            this.tabs = tabs;
            setTimeout(() => this.adjustTabsAppearance(), 10);
        });
    }

    ngAfterViewInit(): void {
        this.adjustTabsAppearance();
    }

    @HostListener('window:resize')
    onResize(): void {
        this.adjustTabsAppearance();
    }

    adjustTabsAppearance(): void {
        if (!this.tabsContainer || !this.tabsContainer.nativeElement) return;

        const container = this.tabsContainer.nativeElement;
        const tabs = container.querySelectorAll('.nav-item');
        const tabCount = tabs.length;

        if (tabCount > 1) {
            // let fontSize = '0.9rem';
            // let padding = '10px 15px';

            // if (tabCount > 5) fontSize = '0.85rem';
            // if (tabCount > 10) fontSize = '0.8rem';
            // if (tabCount > 15) fontSize = '0.75rem';

            // if (tabCount > 5) padding = '8px 12px';
            // if (tabCount > 10) padding = '6px 10px';

            tabs.forEach((tab: Element) => {
                const titleEl = tab.querySelector('.tab-title');
                const linkEl = tab.querySelector('.nav-link');

                // if (titleEl) {
                //     (titleEl as HTMLElement).style.fontSize = fontSize;
                // }

                // if (linkEl) {
                //     (linkEl as HTMLElement).style.padding = padding;
                // }
            });
        }
    }

    activateTab(id: string): void {
        this.tabService.activateTab(id);
    }

    closeTab(id: string, event: MouseEvent): void {
        event.stopPropagation();
        this.tabService.closeTab(id);
    }

    // Affiche le modal de confirmation
    showCloseAllModal(): void {
        this.isModalOpen = true;
    }

    // Confirme la fermeture de tous les onglets
    confirmCloseAllTabs(): void {
        // this.tabService.closeAllTabsExceptDashboard();
        // this.isModalOpen = false;
        window.location.reload(); // Actualiser la page pour refléter les changements
    }

    // Annule la fermeture de tous les onglets
    cancelCloseAllTabs(): void {
        this.isModalOpen = false;
    }
}
