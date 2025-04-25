import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom, Observable } from 'rxjs';
export async function handle<T>(
    allFn: () => Observable<T | null>,
    toastrService: ToastrService,
    loadingBar: LoadingBarService
): Promise<T | void> {
    loadingBar.start();
    try {
        const res: any = await lastValueFrom(allFn());
        if (!res.error) {
            return res;
        }
        toastrService.error(res.message);
        loadingBar.complete();
    } catch (err) {
        const errorMessage = err?.error?.message || 'Une erreur est survenue.';
        toastrService.error(errorMessage);
        throw new Error(errorMessage);
    } finally {
        loadingBar.complete();
    }
}
