export const DEFAULT_ADSENSE_SLOT = "9969163744";

export type AdsensePlacement =
    | "site-top"
    | "home-footer"
    | "column-list"
    | "column-article"
    | "countdown-index"
    | "countdown-qualification"
    | "countdown-exam-detail"
    | "countdown-exam-session"
    | "countdown-university-list"
    | "countdown-university-detail"
    | "countdown-highschool-list"
    | "countdown-highschool-detail"
    | "countdown-highschool-schedule"
    | "mistap-home"
    | "mistap-test-bottom"
    | "mistap-test-setup-word-stock"
    | "mistap-test-setup-normal"
    | "mistap-test-setup-review"
    | "mistap-results-before-incorrect"
    | "mistap-results-after-incorrect"
    | "mistap-history-top"
    | "mistap-blog-list"
    | "mistap-blog-article"
    | "mistap-textbook-lp"
    | "mistap-textbook-directory";

export type AdsenseAdFormat =
    | "auto"
    | "fluid"
    | "rectangle"
    | "horizontal"
    | "vertical"
    | "rectangle, horizontal";

type AdsensePlacementConfig = {
    slot: string;
    channel?: string;
    format: AdsenseAdFormat;
};

const FORMAT_AUTO: AdsenseAdFormat = "auto";
const FORMAT_HORIZONTAL: AdsenseAdFormat = "horizontal";
const FORMAT_RECTANGLE: AdsenseAdFormat = "rectangle";
const FORMAT_RECTANGLE_HORIZONTAL: AdsenseAdFormat = "rectangle, horizontal";

const withFallback = (
    slot: string | undefined,
    channel?: string,
    format: AdsenseAdFormat = FORMAT_AUTO,
): AdsensePlacementConfig => ({
    slot: slot || DEFAULT_ADSENSE_SLOT,
    channel: channel || undefined,
    format,
});

export const ADSENSE_PLACEMENTS: Record<AdsensePlacement, AdsensePlacementConfig> = {
    "site-top": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_SITE_TOP, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_SITE_TOP, FORMAT_HORIZONTAL),
    "home-footer": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_FOOTER, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_HOME_FOOTER, FORMAT_HORIZONTAL),
    "column-list": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COLUMN_LIST, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COLUMN_LIST, FORMAT_HORIZONTAL),
    "column-article": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COLUMN_ARTICLE, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COLUMN_ARTICLE, FORMAT_HORIZONTAL),
    "countdown-index": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COUNTDOWN_INDEX, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COUNTDOWN_INDEX, FORMAT_HORIZONTAL),
    "countdown-qualification": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COUNTDOWN_QUALIFICATION, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COUNTDOWN_QUALIFICATION, FORMAT_HORIZONTAL),
    "countdown-exam-detail": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COUNTDOWN_EXAM_DETAIL, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COUNTDOWN_EXAM_DETAIL, FORMAT_HORIZONTAL),
    "countdown-exam-session": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COUNTDOWN_EXAM_SESSION, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COUNTDOWN_EXAM_SESSION, FORMAT_HORIZONTAL),
    "countdown-university-list": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COUNTDOWN_UNIVERSITY_LIST, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COUNTDOWN_UNIVERSITY_LIST, FORMAT_HORIZONTAL),
    "countdown-university-detail": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COUNTDOWN_UNIVERSITY_DETAIL, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COUNTDOWN_UNIVERSITY_DETAIL, FORMAT_HORIZONTAL),
    "countdown-highschool-list": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COUNTDOWN_HIGHSCHOOL_LIST, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COUNTDOWN_HIGHSCHOOL_LIST, FORMAT_HORIZONTAL),
    "countdown-highschool-detail": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COUNTDOWN_HIGHSCHOOL_DETAIL, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COUNTDOWN_HIGHSCHOOL_DETAIL, FORMAT_HORIZONTAL),
    "countdown-highschool-schedule": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COUNTDOWN_HIGHSCHOOL_SCHEDULE, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COUNTDOWN_HIGHSCHOOL_SCHEDULE, FORMAT_HORIZONTAL),
    "mistap-home": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_HOME, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_HOME, FORMAT_RECTANGLE),
    "mistap-test-bottom": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_TEST_BOTTOM, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_TEST_BOTTOM, FORMAT_RECTANGLE),
    "mistap-test-setup-word-stock": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_TEST_SETUP_WORD_STOCK, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_TEST_SETUP_WORD_STOCK, FORMAT_RECTANGLE),
    "mistap-test-setup-normal": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_TEST_SETUP_NORMAL, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_TEST_SETUP_NORMAL, FORMAT_RECTANGLE),
    "mistap-test-setup-review": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_TEST_SETUP_REVIEW, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_TEST_SETUP_REVIEW, FORMAT_RECTANGLE),
    "mistap-results-before-incorrect": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_RESULTS_BEFORE_INCORRECT, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_RESULTS_BEFORE_INCORRECT, FORMAT_RECTANGLE),
    "mistap-results-after-incorrect": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_RESULTS_AFTER_INCORRECT, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_RESULTS_AFTER_INCORRECT, FORMAT_RECTANGLE),
    "mistap-history-top": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_HISTORY_TOP, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_HISTORY_TOP, FORMAT_RECTANGLE),
    "mistap-blog-list": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_BLOG_LIST, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_BLOG_LIST, FORMAT_RECTANGLE_HORIZONTAL),
    "mistap-blog-article": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_BLOG_ARTICLE, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_BLOG_ARTICLE, FORMAT_RECTANGLE_HORIZONTAL),
    "mistap-textbook-lp": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_TEXTBOOK_LP, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_TEXTBOOK_LP, FORMAT_RECTANGLE_HORIZONTAL),
    "mistap-textbook-directory": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_TEXTBOOK_DIRECTORY, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_TEXTBOOK_DIRECTORY, FORMAT_RECTANGLE_HORIZONTAL),
};

export function getAdsensePlacementConfig(placement?: AdsensePlacement): AdsensePlacementConfig {
    if (!placement) {
        return { slot: DEFAULT_ADSENSE_SLOT, format: FORMAT_AUTO };
    }

    return ADSENSE_PLACEMENTS[placement] || { slot: DEFAULT_ADSENSE_SLOT, format: FORMAT_AUTO };
}
