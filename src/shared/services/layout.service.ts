import { inject, Injectable, OnInit } from '@angular/core';
import { AppCustomizationService } from './app-customization.service';

@Injectable({
    providedIn: 'root',
})
export class LayoutService implements OnInit {
    private readonly customizationService = inject(AppCustomizationService);

    public readonly config = {
        settings: {
            layout: 'Dubai',
            layout_type: this.customizationService.config.layout.type,
            layout_version: this.customizationService.config.layout.version,
            sidebar_type: this.customizationService.config.layout.sidebarType,
            icon: this.customizationService.config.layout.icon,
        },
        color: {
            primary_color: this.customizationService.config.colors.primary,
            secondary_color: this.customizationService.config.colors.secondary,
        },
    };

    ngOnInit(): void {
        this.applyLayoutConfiguration();
    }

    private applyLayoutConfiguration(): void {
        try {
            if (this.config.settings.layout_type === 'rtl') {
                document.documentElement.setAttribute(
                    'dir',
                    this.config.settings.layout_type
                );
            }

            document.documentElement.style.setProperty(
                '--theme-default',
                this.config.color.primary_color
            );
            document.documentElement.style.setProperty(
                '--theme-secondary',
                this.config.color.secondary_color
            );
        } catch (error) {
            console.error('Erreur lors de la configuration du layout:', error);
        }
    }
}
