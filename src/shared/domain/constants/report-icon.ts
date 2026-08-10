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
