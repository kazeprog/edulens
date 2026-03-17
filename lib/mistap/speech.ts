export function sanitizeSpeechText(text: string): string {
    let normalized = text;

    const bracketPatterns = [
        /\([^()]*\)/g,
        /（[^（）]*）/g,
        /\[[^[\]]*\]/g,
        /［[^［］]*］/g,
        /【[^【】]*】/g,
        /〔[^〔〕]*〕/g,
    ];

    let changed = true;
    while (changed) {
        changed = false;
        for (const pattern of bracketPatterns) {
            const next = normalized.replace(pattern, ' ');
            if (next !== normalized) {
                normalized = next;
                changed = true;
            }
        }
    }

    normalized = normalized
        .replace(/[①-⑳㉑-㉟㊱-㊿]/g, ' ')
        .replace(/(^|\s)[0-9０-９]\s*(?=[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}A-Za-z])/gu, '$1');

    return normalized
        .replace(/\s+/g, ' ')
        .replace(/\s+([,.;:!?])/g, '$1')
        .trim();
}

export function detectSpeechLanguage(text: string): string {
    const normalized = sanitizeSpeechText(text);

    if (!normalized) {
        return 'en-US';
    }

    const hasJapanese = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(normalized);
    return hasJapanese ? 'ja-JP' : 'en-US';
}

export function pickSpeechVoice(voices: SpeechSynthesisVoice[], text: string): SpeechSynthesisVoice | undefined {
    const lang = detectSpeechLanguage(text);
    const prefix = lang.startsWith('ja') ? 'ja' : 'en';

    return (
        voices.find((voice) => voice.lang.toLowerCase() === lang.toLowerCase()) ||
        voices.find((voice) => voice.lang.toLowerCase().startsWith(prefix))
    );
}
