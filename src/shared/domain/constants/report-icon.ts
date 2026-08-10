/**
 * Icônes de marqueur par type de signalement, utilisées à la fois par
 * interactive-map (rendu OpenLayers) et management-map (icône du
 * signalement sur la carte de détail).
 *
 * Source unique de vérité : avant, ce mapping était dupliqué dans
 * map.adapter.ts et interactive-map.component.ts.
 */
export type ReportIconType = 'zob' | 'cpo' | 'cps' | 'abi';

export const REPORT_TYPE_ICON_PATHS: Record<ReportIconType, string> = {
    zob: 'assets/images/icones/marker-zb.svg',
    cpo: 'assets/images/icones/marker-ao.svg',
    cps: 'assets/images/icones/marker-ms.svg',
    abi: 'assets/images/icones/marker-ai.svg',
};

/**
 * Résout le chemin d'icône pour un type de signalement, en acceptant
 * soit la forme courte ('zob', 'cpo', ...) utilisée par interactive-map,
 * soit la forme "clé de traduction" ('COMMON.ZOB', ...) utilisée par
 * l'enum partagé `ReportType` (@shared/domain/enums/report-type.enum.ts).
 * @param type
 */
export function getReportTypeIconPath(
    type: string | null | undefined
): string | null {
    if (!type) {
        return null;
    }
    const normalized = type.split('.').pop()?.toLowerCase() as
        | ReportIconType
        | undefined;
    if (!normalized) {
        return null;
    }
    return REPORT_TYPE_ICON_PATHS[normalized] ?? null;
}

/**
 * Couleur associée à chaque type de signalement (même palette que le
 * marqueur de repli `getMarkerColor()` de map.adapter.ts), réutilisée pour
 * teinter des éléments annexes (ex: cercle de rayon d'impact autour du
 * signalement dans management-map) selon le type d'icône affiché.
 */
export const REPORT_TYPE_COLORS: Record<ReportIconType, string> = {
    zob: '#7c3aed',
    cpo: '#0f766e',
    cps: '#be123c',
    abi: '#475569',
};

/**
 * Résout la couleur associée à un type de signalement, en acceptant les
 * mêmes formats que `getReportTypeIconPath` ('zob' ou 'COMMON.ZOB').
 * @param type
 */
export function getReportTypeColor(
    type: string | null | undefined
): string | null {
    if (!type) {
        return null;
    }
    const normalized = type.split('.').pop()?.toLowerCase() as
        | ReportIconType
        | undefined;
    if (!normalized) {
        return null;
    }
    return REPORT_TYPE_COLORS[normalized] ?? null;
}
