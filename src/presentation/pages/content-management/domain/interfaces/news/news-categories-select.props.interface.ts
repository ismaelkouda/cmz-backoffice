import { NewsSubCategoriesSelectProps } from './news-sub-categories-select.props.interface';

export interface NewsCategoriesSelectProps {
    readonly uniqId: number;
    readonly name: string;
    readonly value: string;
    readonly subCategories: readonly NewsSubCategoriesSelectProps[];
}
