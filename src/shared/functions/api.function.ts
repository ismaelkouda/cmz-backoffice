import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
export async function handle<T>(
    allFn: () => Observable<T | null>,
    toastrService: ToastrService,
    loadingBar: LoadingBarService
): Promise<T|void> {
    loadingBar.start();
    try {
        const res = await allFn().toPromise();
        if (!res) { 
            throw new Error("La réponse du serveur est null ou undefined.");
        }
        loadingBar.complete();
        return res;
    } catch (err: any) {
        loadingBar.complete();
        // Extraire le message d'erreur détaillé si disponible
        const errorMessage = err?.error?.message || "Une erreur est survenue.";
        toastrService.error(errorMessage); // Afficher dans un toastr
        throw new Error(errorMessage); // Relancer l'erreur pour un traitement ultérieur
    }
}


