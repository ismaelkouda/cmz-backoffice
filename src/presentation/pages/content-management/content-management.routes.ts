import { Routes } from '@angular/router';

export const HOME_ROUTE = 'home-blocks';
// export const NEWS_ROUTE = 'infos-and-news';
export const SLIDE_ROUTE = 'sliders';
// export const PRIVACY_POLICY_ROUTE = 'privacy-policy';
// export const LEGAL_NOTICE_ROUTE = 'legal-notices';
// export const TERMS_USE_ROUTE = 'terms-of-service';
// export const CREATE_ROUTE = 'create';
// export const EDIT_ROUTE = 'edit';
// export const VIEW_ROUTE = 'view';

export const routes: Routes = [
    {
        path: HOME_ROUTE,
        children: [
            {
                path: '',
                data: {
                    breadcrumb: {
                        label: 'CONTENT_MANAGEMENT.HOME.BREADCRUMB.LABEL',
                        icon: 'CONTENT_MANAGEMENT.HOME.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./presentation/features/home/home.routes').then(
                                (m) => m.HOME_ROUTES
                            ),
                        data: { breadcrumb: { hide: true } },
                    },
                    {
                        path: '**',
                        redirectTo: '',
                    },
                ],
            },
        ],
    },
    // {
    //     path: NEWS_ROUTE,
    //     data: {
    //         breadcrumb: {
    //             label: 'CONTENT_MANAGEMENT.NEWS.BREADCRUMB.LABEL',
    //             icon: 'CONTENT_MANAGEMENT.NEWS.BREADCRUMB.ICON',
    //         },
    //     },
    //     children: [
    //         {
    //             path: '',
    //             loadChildren: () =>
    //                 import('./presentation/features/news/news.routes').then(
    //                     (m) => m.NEWS_ROUTES
    //                 ),
    //             data: { breadcrumb: { hide: true } },
    //         },
    //     ],
    // },

    {
        path: SLIDE_ROUTE,
        children: [
            {
                path: '',
                data: {
                    breadcrumb: {
                        label: 'CONTENT_MANAGEMENT.SLIDE.BREADCRUMB.LABEL',
                        icon: 'CONTENT_MANAGEMENT.SLIDE.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./presentation/features/slide/slide.routes').then(
                                (m) => m.SLIDE_ROUTES
                            ),
                        data: { breadcrumb: { hide: true } },
                    },
                    {
                        path: '**',
                        redirectTo: '',
                    },
                ],
            },
        ],
    },

    // {
    //     path: PRIVACY_POLICY_ROUTE,
    //     data: {
    //         breadcrumb: {
    //             label: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.BREADCRUMB.LABEL',
    //             icon: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.BREADCRUMB.ICON',
    //         },
    //     },
    //     children: [
    //         {
    //             path: '',
    //             loadChildren: () =>
    //                 import('./presentation/features/privacy-policy/privacy-policy.routes').then(
    //                     (m) => m.PRIVACY_POLICY_ROUTES
    //                 ),
    //             data: { breadcrumb: { hide: true } },
    //         },
    //     ],
    // },

    // {
    //     path: TERMS_USE_ROUTE,
    //     data: {
    //         breadcrumb: {
    //             label: 'CONTENT_MANAGEMENT.TERMS_USE.BREADCRUMB.LABEL',
    //             icon: 'CONTENT_MANAGEMENT.TERMS_USE.BREADCRUMB.ICON',
    //         },
    //     },
    //     children: [
    //         {
    //             path: '',
    //             loadChildren: () =>
    //                 import('./presentation/features/terms-use/terms-use.routes').then(
    //                     (m) => m.TERMS_USE_ROUTES
    //                 ),
    //             data: { breadcrumb: { hide: true } },
    //         },
    //     ],
    // },

    // {
    //     path: LEGAL_NOTICE_ROUTE,
    //     data: {
    //         breadcrumb: {
    //             label: 'CONTENT_MANAGEMENT.LEGAL_NOTICE.BREADCRUMB.LABEL',
    //             icon: 'CONTENT_MANAGEMENT.LEGAL_NOTICE.BREADCRUMB.ICON',
    //         },
    //     },
    //     children: [
    //         {
    //             path: '',
    //             loadChildren: () =>
    //                 import('./presentation/features/legal-notice/legal-notice.routes').then(
    //                     (m) => m.LEGAL_NOTICE_ROUTES
    //                 ),
    //             data: { breadcrumb: { hide: true } },
    //         },
    //     ],
    // },
];
