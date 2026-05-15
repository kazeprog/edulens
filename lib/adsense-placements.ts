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

type AdsensePlacementConfig = {
    slot: string;
    channel?: string;
};

const withFallback = (slot: string | undefined, channel?: string): AdsensePlacementConfig => ({
    slot: slot || DEFAULT_ADSENSE_SLOT,
    channel: channel || undefined,
});

export const ADSENSE_PLACEMENTS: Record<AdsensePlacement, AdsensePlacementConfig> = {
    "site-top": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_SITE_TOP, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_SITE_TOP),
    "home-footer": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_FOOTER, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_HOME_FOOTER),
    "column-list": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COLUMN_LIST, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COLUMN_LIST),
    "column-article": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COLUMN_ARTICLE, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COLUMN_ARTICLE),
    "countdown-index": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COUNTDOWN_INDEX, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COUNTDOWN_INDEX),
    "countdown-qualification": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COUNTDOWN_QUALIFICATION, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COUNTDOWN_QUALIFICATION),
    "countdown-exam-detail": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COUNTDOWN_EXAM_DETAIL, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COUNTDOWN_EXAM_DETAIL),
    "countdown-exam-session": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COUNTDOWN_EXAM_SESSION, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COUNTDOWN_EXAM_SESSION),
    "countdown-university-list": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COUNTDOWN_UNIVERSITY_LIST, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COUNTDOWN_UNIVERSITY_LIST),
    "countdown-university-detail": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COUNTDOWN_UNIVERSITY_DETAIL, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COUNTDOWN_UNIVERSITY_DETAIL),
    "countdown-highschool-list": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COUNTDOWN_HIGHSCHOOL_LIST, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COUNTDOWN_HIGHSCHOOL_LIST),
    "countdown-highschool-detail": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COUNTDOWN_HIGHSCHOOL_DETAIL, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COUNTDOWN_HIGHSCHOOL_DETAIL),
    "countdown-highschool-schedule": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_COUNTDOWN_HIGHSCHOOL_SCHEDULE, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_COUNTDOWN_HIGHSCHOOL_SCHEDULE),
    "mistap-home": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_HOME, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_HOME),
    "mistap-test-bottom": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_TEST_BOTTOM, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_TEST_BOTTOM),
    "mistap-test-setup-word-stock": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_TEST_SETUP_WORD_STOCK, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_TEST_SETUP_WORD_STOCK),
    "mistap-test-setup-normal": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_TEST_SETUP_NORMAL, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_TEST_SETUP_NORMAL),
    "mistap-test-setup-review": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_TEST_SETUP_REVIEW, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_TEST_SETUP_REVIEW),
    "mistap-results-before-incorrect": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_RESULTS_BEFORE_INCORRECT, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_RESULTS_BEFORE_INCORRECT),
    "mistap-results-after-incorrect": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_RESULTS_AFTER_INCORRECT, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_RESULTS_AFTER_INCORRECT),
    "mistap-history-top": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_HISTORY_TOP, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_HISTORY_TOP),
    "mistap-blog-list": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_BLOG_LIST, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_BLOG_LIST),
    "mistap-blog-article": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_BLOG_ARTICLE, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_BLOG_ARTICLE),
    "mistap-textbook-lp": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_TEXTBOOK_LP, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_TEXTBOOK_LP),
    "mistap-textbook-directory": withFallback(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MISTAP_TEXTBOOK_DIRECTORY, process.env.NEXT_PUBLIC_ADSENSE_CHANNEL_MISTAP_TEXTBOOK_DIRECTORY),
};

export function getAdsensePlacementConfig(placement?: AdsensePlacement): AdsensePlacementConfig {
    if (!placement) {
        return { slot: DEFAULT_ADSENSE_SLOT };
    }

    return ADSENSE_PLACEMENTS[placement] || { slot: DEFAULT_ADSENSE_SLOT };
}
