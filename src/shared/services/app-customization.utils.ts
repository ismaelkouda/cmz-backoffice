export function getDynamicTitle(defaultTitle: string): string {
    try {
        const url = `${location.protocol}//${location.host}`;
        const titleMap: Record<string, string> = {
            'https://backoffice.mazone-test.ansut.ci':
                'Test CMZ - Back-office - Système de Gestion de Collecte Centralisée',
            'https://cmz-admin.paas.imako.digital':
                'CMZ - Back-office - Système de Gestion de Collecte Centralisée',
            'http://localhost:4411':
                'Local CMZ - Back-office - Système de Gestion de Collecte Centralisée',
        };

        return (
            titleMap[url] || 'CMZ - Système de Gestion de Collecte Centralisée'
        );
    } catch {
        return defaultTitle;
    }
}
