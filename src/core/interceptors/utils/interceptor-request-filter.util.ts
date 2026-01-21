import { ConfigurationService } from '@core/services/configuration.service';

function extractHostname(url: string): string | null {
    try {
        const u = new URL(url);
        return u.hostname;
    } catch {
        return null;
    }
}

export function isAbsoluteUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
}

export function isInternalUrl(
    url: string,
    configService: ConfigurationService
): boolean {
    if (!isAbsoluteUrl(url)) return true;

    const bases = [
        configService.authenticationUrl,
        configService.reportUrl,
        configService.settingUrl,
        configService.fileUrl,
    ].filter(Boolean);

    const hostnames = new Set<string>(
        bases
            .map((b) => {
                try {
                    return new URL(b).hostname;
                } catch {
                    return null;
                }
            })
            .filter((h): h is string => !!h)
    );

    const hostname = extractHostname(url);
    if (!hostname) return false;
    return hostnames.has(hostname);
}

export function isStaticAssetRequest(url: string): boolean {
    if (!url) return false;
    if (url.includes('/assets/') && !url.includes('/assets/i18n/')) return true;
    if (url.includes('/assets/i18n/') && url.endsWith('.json')) return true;

    const staticExt = [
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.svg',
        '.css',
        '.js',
        '.ico',
        '.woff',
        '.woff2',
        '.ttf',
        '.eot',
        '.webp',
        '.webm',
        '.mp4',
    ];
    if (staticExt.some((ext) => url.endsWith(ext))) return true;

    const staticPatterns = [
        'manifest.webmanifest',
        'ngsw-worker.js',
        'ngsw.json',
        'favicon.ico',
    ];
    if (staticPatterns.some((p) => url.includes(p))) return true;

    return false;
}

export function pickBaseForRelativeEndpoint(
    endpoint: string,
    configService: ConfigurationService
): string {
    const e = endpoint.replace(/^\/+/, '');

    if (
        e.startsWith('auth/') ||
        e.startsWith('authentication/') ||
        e.startsWith('login')
    ) {
        return configService.authenticationUrl;
    }
    if (e.startsWith('reports/') || e.startsWith('report/')) {
        return configService.reportUrl;
    }
    if (
        e.startsWith('setting/') ||
        e.startsWith('settings/') ||
        e.startsWith('base-settings/')
    ) {
        return configService.settingUrl;
    }
    if (e.startsWith('files/') || e.startsWith('upload/')) {
        return configService.fileUrl ?? configService.authenticationUrl;
    }

    return configService.authenticationUrl;
}
