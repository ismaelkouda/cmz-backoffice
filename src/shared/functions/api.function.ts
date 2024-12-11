import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
export async function handle(allFn: () => Observable<any>, toastrService: ToastrService, loadingBar: LoadingBarService): Promise<void> {
    loadingBar.start();
    try {
        const res = await allFn().toPromise();
        console.log('res', res)
        if (res?.error) {
                loadingBar.stop();
                toastrService.error(res.message);
        } else {
            loadingBar.complete();
            return res;
        }
    } catch (err) {
        loadingBar.complete();
        // toastrService.error(err.error.message);
    }
}