import {
    ActivatedRouteSnapshot,
    DetachedRouteHandle,
    RouteReuseStrategy,
} from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
    private storedRoutes = new Map<string, DetachedRouteHandle>();

    // Détermine si la route doit être détachée pour être réutilisée plus tard
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return route.data?.['reuseComponent'] === true;
    }

    // Stocke le composant détaché
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        const id = this.getRouteId(route);
        if (id) {
            this.storedRoutes.set(id, handle);
        }
    }

    // Détermine si une route doit être réutilisée
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const id = this.getRouteId(route);
        return !!id && !!this.storedRoutes.get(id);
    }

    // Récupère le composant stocké
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        const id = this.getRouteId(route);
        if (!id) {
            return null;
        }
        return this.storedRoutes.get(id) || null;
    }

    // Détermine si le même composant doit être réutilisé pour une nouvelle route
    shouldReuseRoute(
        future: ActivatedRouteSnapshot,
        curr: ActivatedRouteSnapshot
    ): boolean {
        return future.routeConfig === curr.routeConfig;
    }

    // Supprime un composant stocké (à appeler lors de la fermeture d'un onglet)
    clearHandle(path: string): void {
        const routesToDelete: string[] = [];

        this.storedRoutes.forEach((handle, key) => {
            if (key.includes(path)) {
                routesToDelete.push(key);
            }
        });

        routesToDelete.forEach((key) => {
            this.storedRoutes.delete(key);
        });
    }

    // Génère un ID unique pour une route
    private getRouteId(route: ActivatedRouteSnapshot): string | null {
        if (!route.routeConfig) {
            return null;
        }

        // Construire le chemin complet incluant les paramètres
        let path = route.routeConfig.path || '';

        // Ajouter les paramètres pour distinguer les routes avec des paramètres différents
        if (route.params && Object.keys(route.params).length > 0) {
            path +=
                '?' +
                Object.entries(route.params)
                    .map(([key, value]) => `${key}=${value}`)
                    .join('&');
        }

        return path;
    }
}
