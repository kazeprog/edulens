import { createClient } from "microcms-js-sdk";

// Mistap Client Initialization
// 移行期間中のため、旧環境変数もフォールバックとしてサポート
const mistapServiceDomain = process.env.MISTAP_SERVICE_DOMAIN || process.env.MICROCMS_SERVICE_DOMAIN;
const mistapApiKey = process.env.MISTAP_API_KEY || process.env.MICROCMS_API_KEY;

if (!mistapServiceDomain || !mistapApiKey) {
  throw new Error(
    "MISTAP_SERVICE_DOMAIN (or MICROCMS_SERVICE_DOMAIN) and MISTAP_API_KEY (or MICROCMS_API_KEY) must be set in environment variables"
  );
}

export const mistapClient = createClient({
  serviceDomain: mistapServiceDomain,
  apiKey: mistapApiKey,
});

// EduLens Blog Client Initialization
// こちらは新規のため、新しい環境変数が必須
const edulensServiceDomain = process.env.EDULENS_SERVICE_DOMAIN;
const edulensApiKey = process.env.EDULENS_API_KEY;

// APIキーがない場合でもビルドが落ちないように、ダミークライアントを返す（使用時にエラー）
export const blogClient = (edulensServiceDomain && edulensApiKey)
  ? createClient({
    serviceDomain: edulensServiceDomain,
    apiKey: edulensApiKey,
  })
  : {
    getList: async () => { throw new Error("EDULENS_SERVICE_DOMAIN or EDULENS_API_KEY is not set."); },
    getListDetail: async () => { throw new Error("EDULENS_SERVICE_DOMAIN or EDULENS_API_KEY is not set."); },
    getObject: async () => { throw new Error("EDULENS_SERVICE_DOMAIN or EDULENS_API_KEY is not set."); },
    create: async () => { throw new Error("EDULENS_SERVICE_DOMAIN or EDULENS_API_KEY is not set."); },
    update: async () => { throw new Error("EDULENS_SERVICE_DOMAIN or EDULENS_API_KEY is not set."); },
    delete: async () => { throw new Error("EDULENS_SERVICE_DOMAIN or EDULENS_API_KEY is not set."); },
  } as unknown as ReturnType<typeof createClient>;

// 使用時にエラーを出すためのチェック関数（必要に応じて）
export const isBlogClientAvailable = () => {
  return !!edulensServiceDomain && !!edulensApiKey;
};