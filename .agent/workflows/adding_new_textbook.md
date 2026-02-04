---
description: Procedure for adding a new vocabulary book or textbook to Mistap
---

# Adding a New Textbook/Wordbook

Follow this workflow to add a new textbook or wordbook to Mistap. This process ensures the book appears in the UI, data is loaded correctly from local JSON (prioritizing it over Supabase), and tests can be created without errors.

## 1. Data Preparation
1.  **Prepare JSON Data**:
    -   Ensure the data is in the correct JSON format array of objects.
    -   Required fields: `textbook` (exact name), `word_number`, `word`, `meaning`.
    -   Place the file in `lib/data/json/` (e.g., `lib/data/json/my-new-book.json`).
2.  **Format Check**:
    -   Ensure meanings do not contain problematic characters (e.g., replace semicolons `;` or `；` with spaces if required).

## 2. Register Data in Logic
**Target File**: `lib/mistap/jsonTextbookData.ts`

1.  **Import the JSON file**:
    ```typescript
    import myNewBookData from "@/lib/data/json/my-new-book.json";
    ```
2.  **Update `DATA_MAP`**:
    -   Add entries for the new book.
    -   Include the exact name associated with the book.
    -   Include normalized keys (lowercase, hyphens) to handle loose matching.
    ```typescript
    const DATA_MAP: Record<string, TextbookWord[]> = {
        // ... existing entries
        "my-new-book": myNewBookData as TextbookWord[],
        "正式な単語帳名": myNewBookData as TextbookWord[],
        // ...
    };
    ```
3.  **Update `getJsonTextbookData`**:
    -   Add a specific `if` clause for robust matching if needed (though `DATA_MAP` usually covers it).
    ```typescript
    if (normalized.includes("my-new-book") || textbookName.includes("正式な単語帳名")) return DATA_MAP["my-new-book"];
    ```

## 3. Update UI & Lists
**Target Files**: 
- `app/mistap/test-setup/page.tsx` (Dedicated Setup Page)
- `components/mistap/TestSetupContent.tsx` (Shared Component / Homepage)

**You must perform these steps in BOTH files to ensure consistency.**

1.  **Add to Constant Lists**:
    -   Locate `juniorTexts`, `seniorTexts`, or `universityTexts` arrays inside the component.
    -   Add the **exact** textbook name string to the appropriate array.
    ```typescript
    const seniorTexts = useMemo(() => [
      // ...
      "正式な単語帳名",
    ], []);
    ```

2.  **Verify UI Logic (JSX)**:
    -   In both files, the `select` element groups textbooks. You must update these groups.
    -   **Add to `optgroup`**: Locate the `<optgroup label="📖 英単語">` or `<optgroup label="📜 古文単語">` and add your new book to the array being mapped.
    ```tsx
    <optgroup label="📜 古文単語">
      {["既存1", "既存2", "正式な単語帳名"] // ここに追加
        .filter(text => texts.includes(text))
        .map(text => (
          <option key={text} value={text}>{text}</option>
        ))}
    </optgroup>
    ```
    -   **Update Fallback Condition**: Scroll down to the condition that displays all available textbooks if none of the predefined ones are found. You must add your textbook to the `.some()` check.
    ```tsx
    {(!["LEAP", ...].some(t => texts.includes(t)) && 
      !["既存1", "既存2", "正式な単語帳名"].some(t => texts.includes(t))) && ( // ここにも追加
      <>
        {texts.map(text => (
          <option key={text} value={text}>{text}</option>
        ))}
      </>
    )}
    ```

3.  **Verify `fetchTexts` / State Initialization**:
    -   Ensure the strictly governed `texts` state includes valid local textbooks even if Supabase doesn't return them yet.
    -   *Self-Correction from past errors*: The logic currently merges `AVAILABLE_TEXTBOOKS` (derived from `jsonTextbookData.ts`) into the state. **Verify that `AVAILABLE_TEXTBOOKS` is properly imported and used in the `useState` initialization.**
    ```typescript
    const [texts, setTexts] = useState<string[]>(() => {
      // Ensure AVAILABLE_TEXTBOOKS is used as base
      const defaults = AVAILABLE_TEXTBOOKS && AVAILABLE_TEXTBOOKS.length > 0
        ? [...AVAILABLE_TEXTBOOKS]
        : ["ターゲット1900", "ターゲット1400"];
      // ...
    });
    ```

## 5. Verify Test Creation Logic
**Target Files**: `components/mistap/TestSetupContent.tsx` & `app/mistap/test-setup/page.tsx`

1.  **Check `createTestImpl`**:
    -   Ensure `getJsonTextbookData` is called **BEFORE** Supabase fallback.
    -   *Common Error*: Relying solely on Supabase `words` table. If the data is only in local JSON, Supabase query will return empty, causing "Range not found" error.
    ```typescript
    // Verify this pattern exists:
    if (initialData) {
       // ... uses initialData
    } else {
       // 1. Try Local JSON
       const localData = getJsonTextbookData(sText);
       if (localData) { /* use localData */ }
       
       // 2. Fallback to Supabase
       if (!data) { /* await supabase... */ }
    }
    ```

## 4. Update Textbook Hub
**Target Files**: 
- `app/mistap/textbook/page.tsx` (Index Page)
- `app/mistap/textbook/[slug]/page.tsx` (Individual LP)

1.  **Create LP Page**:
    -   Create a new directory `app/mistap/textbook/[slug]` (e.g., `app/mistap/textbook/my-new-book`).
    -   Create `page.tsx` inside it.
    -   Copy content from `app/mistap/textbook/target-1900/page.tsx` or similar as a template.
    -   Update `metadata` (title, description).
    -   **Update `metadata.keywords`:** Add the following SEO keywords to `metadata.keywords`. Replace `(単語帳名)` with the specific textbook name (including variations like "正式名称", "略称", and "Alphabet Notation").
        ```typescript
        keywords: [
          '(単語帳名)',
          '(単語帳名) アプリ',
          '(単語帳名) テスト アプリ',
          '(単語帳名) 単語テスト',
          '(単語帳名) 単語テスト アプリ',
          '(単語帳名) 小テスト',
          '(単語帳名) 小テスト アプリ',
          '(単語帳名) 小テスト メーカー',
          '(単語帳名) 小テスト ジェネレーター',
          // ... other relevant keywords
        ],
        ```
    -   Update `TextbookLPTemplate` props (`textbookName`, `presetTextbook`, `seoSettings`, etc.).
    -   **Important**: `presetTextbook` must match the name used in `jsonTextbookData.ts` and `TestSetupContent.tsx`.

2.  **Add to Index List**:
    -   Open `app/mistap/textbook/page.tsx`.
    -   Add an entry to the appropriate array (e.g., `universityTextbooks`).
    -   Ensure `path` matches your new directory structure.

## 5. Verify Test Creation Logic
1.  **Start Dev Server**: `npm run dev`
2.  **Check Homepage (`/mistap`)**:
    -   Is the new textbook visible in the dropdown?
    -   Does selecting it work?
3.  **Check Setup Page (`/mistap/test-setup`)**:
    -   Is it visible here too?
4.  **Create a Test**:
    -   Try creating a test with range 1-100.
    -   **Success**: Test page loads with questions.
    -   **Failure**: "Range not found" alert -> Check step 4 (Local JSON fallback) and step 2 (DATA_MAP).

## Common Pitfalls & Anti-Patterns to Avoid
-   **Editing only one file**: Forgetting to update `TestSetupContent.tsx` after updating `page.tsx` (or vice versa) leads to inconsistent behavior between the homepage and the dedicated test page.
-   **Syntax Errors during Edit**: When adding to `DATA_MAP` or `seniorTexts`, be careful with commas and brackets. Use `view_file` to understand the context before `replace_file_content`.
-   **Misplaced Imports**: Do not add imports inside component functions. Always add them at the top of the file.
-   **Supabase Dependency**: Do not assume data is in Supabase. Always implement the local JSON path for new content.
