/**
 * グループ機能の型定義
 */

// グループ
export interface Group {
    id: number;
    name: string;
    invite_code: string;
    owner_id: string;
    created_at: string;
}

// グループメンバー
export interface GroupMember {
    id: number;
    group_id: number;
    user_id: string;
    joined_at: string;
}

// メンバー数付きグループ
export interface GroupWithMemberCount extends Group {
    member_count: number;
}

// プロフィール付きメンバー（ランキング表示用）
export interface GroupMemberWithProfile extends GroupMember {
    profile: {
        id: string;
        full_name: string | null;
        grade: string | null;
    };
}

// ランキングデータ
export interface RankingEntry {
    user_id: string;
    full_name: string | null;
    test_count: number;
    rank: number;
}

// グループ参加結果
export interface JoinGroupResult {
    success: boolean;
    error?: string;
    group?: Group;
}
