import MVT from 'ol/format/MVT';

/**
 * Fabrique une fonction de chargement de tuile OpenLayers qui ajoute les
 * en-têtes d'authentification à la requête fetch avant de décoder le
 * contenu PBF/MVT. Réutilisable par tout composant ayant besoin
 * d'afficher des tuiles vectorielles protégées (ex: infrastructures).
 *
 * Basé sur le pattern déjà utilisé dans interactive-map's MapAdapter.
 * @param getHeaders
 */
export function createAuthenticatedVectorTileLoader(
    getHeaders: () => HeadersInit
) {
    return (tile: any, url: string): void => {
        tile.setLoader(
            async (
                extent: unknown,
                _resolution: unknown,
                projection: unknown
            ) => {
                try {
                    const response = await fetch(url, {
                        headers: getHeaders(),
                    });

                    if (!response.ok) {
                        // Log explicite du statut : sans ça, une tuile en
                        // erreur (401/403/404/500 côté backend) échoue
                        // silencieusement et ressemble à "l'API n'est
                        // jamais appelée" alors qu'elle l'est bien.
                        console.warn(
                            `[vector-tile-loader] Réponse non-OK (${response.status}) pour`,
                            url
                        );
                        tile.setFeatures([]);
                        return;
                    }

                    const data = await response.arrayBuffer();
                    const format = new MVT({ idProperty: 'id' });
                    const features = format.readFeatures(data, {
                        extent: extent as number[],
                        featureProjection: projection as string,
                    });

                    tile.setFeatures(features as unknown as any[]);
                } catch (error) {
                    console.error(
                        '[vector-tile-loader] Erreur décodage tuile:',
                        url,
                        error
                    );
                    tile.setFeatures([]);
                }
            }
        );
    };
}
