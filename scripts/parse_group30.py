import json

def parse_group30_data(raw_text):
    lines = raw_text.strip().split('\n')
    result = []
    
    for i, line in enumerate(lines, 1):
        if not line.strip():
            continue
            
        parts = line.split('\t')
        if len(parts) >= 2:
            word_part = parts[0].strip()
            meaning = parts[1].strip()
            
            result.append({
                "textbook": "GROUP30で覚える古文単語600",
                "wordNumber": i,
                "word": word_part,
                "meaning": meaning
            })
            
    return result

with open('c:/Users/ohara/git/edulens/scripts/raw_group30.txt', 'r', encoding='utf-8') as f:
    raw_text = f.read()

data = parse_group30_data(raw_text)

with open('c:/Users/ohara/git/edulens/lib/data/json/group30-kobun-600.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Generated {len(data)} words.")
