// import { LoggingService } from './../../../core/services/logging.service';
// import { Component, OnInit, Optional, PLATFORM_ID, Inject } from '@angular/core';
// import { isPlatformServer } from '@angular/common';
// import { RESPONSE } from '@nguniversal/express-engine';

// interface PartialResponse {
//   status(code: number): this;
// }

// @Component({
//   selector: 'app-not-found',
//   template: `<h1>Page Not Found</h1>`,
// })
// export class NotFoundComponent implements OnInit {
//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     @Optional() @Inject(RESPONSE) private response: PartialResponse,
//     private loggingService: LoggingService // Inject the logging service for error logging
//   ) {}

//   ngOnInit(): void {
//     // Ensure we only interact with the response on the server side
//     if (isPlatformServer(this.platformId) && this.response) {
//       this.response.status(404); // Set HTTP status to 404 on the server side
//     }

//     // Log the access attempt
//     this.loggingService.logError('Page not found: ' + window.location.href);
//   }
// }
