import { Provider } from '@angular/core';
import { homeFindOneProviders } from '@pages/content-management/di/home/home-find-one.providers';
import { homeProviders } from '@pages/content-management/di/home/home.providers';
import { legalNoticeFindOneProviders } from '@pages/content-management/di/legal-notice/legal-notice-find-one.providers';
import { legalNoticeProviders } from '@pages/content-management/di/legal-notice/legal-notice.providers';
import { newsCategoriesSelectProviders } from '@pages/content-management/di/news/news-categories-select.providers';
import { newsFindOneProviders } from '@pages/content-management/di/news/news-find-one.providers';
import { newsProviders } from '@pages/content-management/di/news/news.providers';
import { privacyPolicyFindOneProviders } from '@pages/content-management/di/privacy-policy/privacy-policy-find-one.providers';
import { privacyPolicyProviders } from '@pages/content-management/di/privacy-policy/privacy-policy.providers';
import { slideFindOneProviders } from '@pages/content-management/di/slide/slide-find-one.providers';
import { slideProviders } from '@pages/content-management/di/slide/slide.providers';
import { termsUseFindOneProviders } from '@pages/content-management/di/terms-use/terms-use-find-one.providers';
import { termsUseProviders } from '@pages/content-management/di/terms-use/terms-use.providers';

export const provideContentManagement = (): Provider[] => [
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
