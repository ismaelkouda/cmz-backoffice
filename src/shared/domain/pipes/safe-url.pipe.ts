import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export const ALLOWED_EMBED_HOSTS: readonly string[] = [
    'ansut.ci',
    'imako.digital',
    '10.10.0.65',
];

@Pipe({
    name: 'safeUrl',
    standalone: true,
})
export class SafeUrlPipe implements PipeTransform {
    private readonly sanitizer = inject(DomSanitizer);

    transform(
        url: string,
        allowedHosts: readonly string[] = ALLOWED_EMBED_HOSTS
    ): SafeResourceUrl | null {
        return this.isAllowed(url, allowedHosts)
            ? this.sanitizer.bypassSecurityTrustResourceUrl(url)
            : null;
    }

    private isAllowed(url: string, allowedHosts: readonly string[]): boolean {
        if (!url?.trim()) {
            return false;
        }

        let parsed: URL;
        try {
            parsed = new URL(url);
        } catch {
            return false;
        }

        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return false;
        }

        if (parsed.username || parsed.password) {
            return false;
        }

        const hostname = parsed.hostname.toLowerCase();

        return allowedHosts.some((allowed) => {
            const suffix = allowed.toLowerCase();
            return hostname === suffix || hostname.endsWith(`.${suffix}`);
        });
    }
}
