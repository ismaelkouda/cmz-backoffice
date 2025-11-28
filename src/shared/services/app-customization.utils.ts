export function getDynamicTitle(defaultTitle: string): string {
    try {
        const url = `${location.protocol}//${location.host}`;
        const titleMap: Record<string, string> = {
            'https://sim-monitoring.cateli.io:11555':
                'Système de Gestion du Patrimoine des Cartes SIM et des demandes de Produits & Services',
            'https://osim-monitoring.orange.ci:11555':
                'Système de surveillance de données Collectées',
        };

        return (
            titleMap[url] ||
            'Cateli Data Collector - Système de Gestion de Collecte Centralisée'
        );
    } catch {
        return defaultTitle;
    }
}
