// import { Routes } from '@angular/router';

// export const MESSAGING_ROUTE = 'messaging';
// export const NOTIFICATIONS_ROUTE = 'notification';

// export const routes: Routes = [
//     {
//         path: '',
//         children: [
//             {
//                 path: NOTIFICATIONS_ROUTE,
//                 data: {
//                     breadcrumb: {
//                         label: 'COMMUNICATION.NOTIFICATIONS.TITLE',
//                         icon: 'COMMUNICATION.NOTIFICATIONS.TITLE',
//                     },
//                 },
//                 children: [
//                     {
//                         path: '',
//                         loadChildren: () =>
//                             import(
//                                 './presentation/notifications/notifications.routes'
//                             ).then((m) => m.NOTIFICATIONS_ROUTES),
//                         data: { breadcrumb: { hide: true } },
//                     },
//                     {
//                         path: '**',
//                         redirectTo: '',
//                     },
//                 ],
//             },
//             {
//                 path: MESSAGING_ROUTE,
//                 data: {
//                     breadcrumb: {
//                         label: 'COMMUNICATION.MESSAGING.TITLE',
//                         icon: 'COMMUNICATION.MESSAGING.TITLE',
//                     },
//                 },
//                 children: [
//                     {
//                         path: '',
//                         loadChildren: () =>
//                             import(
//                                 './presentation/messaging/messaging.routes'
//                             ).then((m) => m.MESSAGING_ROUTES),
//                         data: { breadcrumb: { hide: true } },
//                     },
//                     {
//                         path: '**',
//                         redirectTo: '',
//                     },
//                 ],
//             },
//         ]
//     }
// ];
