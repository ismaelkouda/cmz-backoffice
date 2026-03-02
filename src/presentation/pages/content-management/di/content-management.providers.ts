import { inject, Provider } from '@angular/core';

import { EnvService } from '@shared/domain/services/env.service';

import { homeFindOneProviders } from '@presentation/pages/content-management/di/home/home-find-one.providers';
import { homeProviders } from '@presentation/pages/content-management/di/home/home.providers';
import { legalNoticeFindOneProviders } from '@presentation/pages/content-management/di/legal-notice/legal-notice-find-one.providers';
import { legalNoticeProviders } from '@presentation/pages/content-management/di/legal-notice/legal-notice.providers';
import { newsCategoriesSelectProviders } from '@presentation/pages/content-management/di/news/news-categories-select.providers';
import { newsFindOneProviders } from '@presentation/pages/content-management/di/news/news-find-one.providers';
import { newsProviders } from '@presentation/pages/content-management/di/news/news.providers';
import { privacyPolicyFindOneProviders } from '@presentation/pages/content-management/di/privacy-policy/privacy-policy-find-one.providers';
import { privacyPolicyProviders } from '@presentation/pages/content-management/di/privacy-policy/privacy-policy.providers';
import { slideFindOneProviders } from '@presentation/pages/content-management/di/slide/slide-find-one.providers';
import { slideProviders } from '@presentation/pages/content-management/di/slide/slide.providers';
import { termsUseFindOneProviders } from '@presentation/pages/content-management/di/terms-use/terms-use-find-one.providers';
import { termsUseProviders } from '@presentation/pages/content-management/di/terms-use/terms-use.providers';
import { CONTENT_MANAGEMENT_BASE_URL } from '@presentation/pages/content-management/infrastructure/api/content-management.base-url';

const getApiBaseUrl = () => {
    const baseUrl = inject(EnvService).authenticationUrl;

    if (!baseUrl) {
        console.warn(
            'ContentManagement Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

export const provideContentManagement = (): Provider[] => [
    {
        provide: CONTENT_MANAGEMENT_BASE_URL,
        useFactory: getApiBaseUrl,
    },
    ...homeProviders,
    ...homeFindOneProviders,

    ...newsProviders,
    ...newsFindOneProviders,
    ...newsCategoriesSelectProviders,

    ...slideProviders,
    ...slideFindOneProviders,

    ...legalNoticeProviders,
    ...legalNoticeFindOneProviders,

    ...privacyPolicyProviders,
    ...privacyPolicyFindOneProviders,

    ...termsUseProviders,
    ...termsUseFindOneProviders,
];
