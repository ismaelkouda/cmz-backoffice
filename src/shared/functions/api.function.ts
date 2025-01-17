import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
export async function handle<T>(allFn: () => Observable<T | null>, toastrService: ToastrService, loadingBar: LoadingBarService): Promise<T | null> {
    loadingBar.start();
    try {
        const res = await allFn().toPromise();
        if (res === undefined) {
            throw new Error("La réponse est null ou undefined.");
        }
        loadingBar.complete();
        return res;
        // if (res?.error) {
        //         loadingBar.stop();
        //         toastrService.error(res.message);
        //         return res;
        // } else {
        //     loadingBar.complete();
        //     return res;
        // }
    } catch (err) {
        loadingBar.complete();
        toastrService.error(err?.error?.message || "Une erreur est survenue");
        return null;
        // toastrService.error(err.error.message);
    }
}