import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from '../utils/custom-route-reuse-strategy';

export interface Tab {
    id: string;
    title: string;
    path: string;
    icon?: string | null;
    active: boolean;
    closable: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class TabService {
    private _tabs = new BehaviorSubject<Tab[]>([]);
    public tabs$ = this._tabs.asObservable();

    constructor(
        private router: Router,
        private routeReuseStrategy: RouteReuseStrategy
    ) {
        // Commencer avec un tableau vide
        this._tabs.next([]);

        // Ajouter l'onglet du tableau de bord par défaut sans icône
        setTimeout(() => {
            // Utiliser null explicitement pour indiquer qu'aucune icône ne doit être affichée
            this.addTab('Tableau de bord', '/dashboard', false);
        }, 10);
    }

    get tabs(): Tab[] {
        return this._tabs.getValue();
    }

    set tabs(tabs: Tab[]) {
        this._tabs.next(tabs);
    }

    /**
     * Ajoute un nouvel onglet ou active l'onglet existant
     * @param title Titre de l'onglet
     * @param path Chemin de la route
     * @param closable Si l'onglet peut être fermé (par défaut: true)
     */
    addTab(title: string, path: string, closable: boolean = true): void {
        const id = this.generateId(path);
        const tabs = this.tabs;
        const existingTab = tabs.find((tab) => tab.id === id);

        if (existingTab) {
            // Si l'onglet existe déjà, l'activer
            this.activateTab(id);
        } else {
            // Désactiver tous les onglets actuels
            tabs.forEach((tab) => (tab.active = false));

            // Ajouter le nouvel onglet
            tabs.push({
                id,
                title,
                path,
                active: true,
                closable,
            });

            this.tabs = [...tabs];
        }

        // Naviguer vers le chemin
        this.router.navigate([path]);
    }

    /**
     * Active un onglet spécifique
     */
    activateTab(id: string): void {
        const tabs = this.tabs.map((tab) => ({
            ...tab,
            active: tab.id === id,
        }));

        this.tabs = tabs;

        const activeTab = tabs.find((tab) => tab.id === id);
        if (activeTab) {
            this.router.navigate([activeTab.path]);
        }
    }

    /**
     * Ferme un onglet
     */
    closeTab(id: string): void {
        let tabs = this.tabs;
        const index = tabs.findIndex((tab) => tab.id === id);

        if (index === -1) return;

        // Vérifier si l'onglet peut être fermé
        if (!tabs[index].closable) return;

        const wasActive = tabs[index].active;
        const closedTabPath = tabs[index].path;

        // Filtrer l'onglet fermé
        tabs = tabs.filter((tab) => tab.id !== id);

        // Si l'onglet fermé était actif, activer le précédent ou le suivant
        if (wasActive && tabs.length > 0) {
            const newActiveIndex = Math.min(index, tabs.length - 1);
            tabs[newActiveIndex].active = true;
            this.router.navigate([tabs[newActiveIndex].path]);
        }

        this.tabs = tabs;

        // Nettoyer le composant stocké
        if (this.routeReuseStrategy instanceof CustomRouteReuseStrategy) {
            this.routeReuseStrategy.clearHandle(closedTabPath);
        }
    }

    /**
     * Génère un ID unique pour un onglet basé sur son chemin
     */
    private generateId(path: string): string {
        return path.replace(/[^a-zA-Z0-9]/g, '_');
    }

    /**
     * Ferme tous les onglets sauf le tableau de bord
     */
    closeAllTabsExceptDashboard(): void {
        // Trouver l'ID de l'onglet Tableau de bord
        const dashboardTabId = this.generateId('/dashboard');

        // Filtrer tous les onglets sauf le tableau de bord
        const tabsToClose = this.tabs.filter(
            (tab) => tab.id !== dashboardTabId && tab.closable
        );

        // Stocker les chemins des onglets à fermer pour nettoyer les composants
        const pathsToClose = tabsToClose.map((tab) => tab.path);

        // Conserver uniquement le tableau de bord
        const newTabs = this.tabs.filter((tab) => tab.id === dashboardTabId);

        // Si le tableau de bord existe, l'activer
        if (newTabs.length > 0) {
            newTabs[0].active = true;
            this.tabs = newTabs;
            this.router.navigate(['/dashboard']);

            // Nettoyer les composants des onglets fermés
            if (this.routeReuseStrategy instanceof CustomRouteReuseStrategy) {
                pathsToClose.forEach((path) => {
                    (
                        this.routeReuseStrategy as CustomRouteReuseStrategy
                    ).clearHandle(path);
                });
            }
        }
    }
}
