import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
// @ts-ignore
export class GlobalErrorHandlerService implements ErrorHandler {

    constructor() {
    }


    handleError(error: Error | HttpErrorResponse) {
        console.error(error);
    }

}
