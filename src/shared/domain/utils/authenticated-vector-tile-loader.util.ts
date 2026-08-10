import MVT from 'ol/format/MVT';

/**
 * Fabrique une fonction de chargement de tuile OpenLayers qui ajoute les
 * en-têtes d'authentification à la requête fetch avant de décoder le
 * contenu PBF/MVT. Réutilisable par tout composant ayant besoin
 * d'afficher des tuiles vectorielles protégées (ex: infrastructures).
 *
 * Basé sur le pattern déjà utilisé dans interactive-map's MapAdapter.
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
                    console.error('Erreur décodage tuile:', error);
                    tile.setFeatures([]);
                }
            }
        );
    };
}
