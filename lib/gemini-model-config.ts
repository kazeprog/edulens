export const GEMINI_MODEL_DEFAULTS = {
    gemini_model_shared_primary: 'gemini-2.5-flash',
    gemini_model_shared_fallback: 'gemini-2.5-flash-lite',
    gemini_model_naruhodo_primary: 'gemini-2.0-flash',
    gemini_model_naruhodo_fallback: 'gemini-2.5-flash-lite',
    gemini_model_admin_search: 'gemini-2.0-flash',
} as const;

export type GeminiModelConfigKey = keyof typeof GEMINI_MODEL_DEFAULTS;
export type GeminiModelSettings = Record<GeminiModelConfigKey, string>;

export type GeminiConfigRow = {
    key: string;
    value: unknown;
};

export const GEMINI_MODEL_CONFIG_KEYS = Object.keys(GEMINI_MODEL_DEFAULTS) as GeminiModelConfigKey[];

export const GEMINI_MODEL_CONFIG_DEFINITIONS: Array<{
    key: GeminiModelConfigKey;
    label: string;
    description: string;
}> = [
    {
        key: 'gemini_model_shared_primary',
        label: '共通 Gemini モデル',
        description: '英作文採点、詳細分析、入試取り込みなどで使うメインモデル',
    },
    {
        key: 'gemini_model_shared_fallback',
        label: '共通 Gemini フォールバック',
        description: '共通処理でキー切替後も失敗したときの予備モデル',
    },
    {
        key: 'gemini_model_naruhodo_primary',
        label: 'ナルホドレンズ',
        description: 'ナルホドレンズ本体で使うメインモデル',
    },
    {
        key: 'gemini_model_naruhodo_fallback',
        label: 'ナルホドレンズ フォールバック',
        description: 'ナルホドレンズでメインモデル失敗時に使う予備モデル',
    },
    {
        key: 'gemini_model_admin_search',
        label: '管理画面の入試 URL 検索',
        description: '管理画面の URL 自動検索で使うモデル',
    },
];

export function getDefaultGeminiModelSettings(): GeminiModelSettings {
    return { ...GEMINI_MODEL_DEFAULTS };
}

export function resolveGeminiModelValue(
    value: unknown,
    fallbackKey: GeminiModelConfigKey,
): string {
    if (typeof value !== 'string') {
        return GEMINI_MODEL_DEFAULTS[fallbackKey];
    }

    const trimmedValue = value.trim();
    return trimmedValue || GEMINI_MODEL_DEFAULTS[fallbackKey];
}

export function resolveGeminiModelSettings(rows?: GeminiConfigRow[] | null): GeminiModelSettings {
    const settings = getDefaultGeminiModelSettings();

    for (const row of rows ?? []) {
        if (!(row.key in GEMINI_MODEL_DEFAULTS)) {
            continue;
        }

        const key = row.key as GeminiModelConfigKey;
        settings[key] = resolveGeminiModelValue(row.value, key);
    }

    return settings;
}
