/**
 * グループ機能のユーティリティ関数
 */
import { getSupabase } from '@/lib/supabase';
import type { Group, GroupMember, JoinGroupResult, RankingEntry } from '@/types/group';

/**
 * 招待コードを生成する（6文字の英数字）
 */
export function generateInviteCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * 招待コードからグループ情報を取得
 */
export async function getGroupByInviteCode(inviteCode: string): Promise<Group | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
        .rpc('get_group_by_invite_code', { code: inviteCode });

    if (error || !data || data.length === 0) {
        return null;
    }

    return data[0] as Group;
}

/**
 * ユーザーをグループに参加させる
 */
export async function joinGroup(userId: string, inviteCode: string): Promise<JoinGroupResult> {
    const supabase = getSupabase();
    if (!supabase) {
        return { success: false, error: 'データベース接続エラー' };
    }

    // 1. グループを取得
    const { data: groupData, error: groupError } = await supabase
        .rpc('get_group_by_invite_code', { code: inviteCode });

    if (groupError || !groupData || groupData.length === 0) {
        return { success: false, error: 'グループが見つかりません' };
    }

    const group = groupData[0] as Group;

    // 2. 既に参加しているかチェック
    const { data: existingMember } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', group.id)
        .eq('user_id', userId)
        .single();

    if (existingMember) {
        return { success: true, group }; // 既に参加済み
    }

    // 3. グループに参加
    const { error: joinError } = await supabase
        .from('group_members')
        .insert({
            group_id: group.id,
            user_id: userId
        });

    if (joinError) {
        console.error('Join group error:', joinError);
        return { success: false, error: 'グループへの参加に失敗しました' };
    }

    return { success: true, group };
}

/**
 * ユーザーの所属グループ一覧を取得
 */
export async function getUserGroups(userId: string): Promise<Group[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    // オーナーとして所有 + メンバーとして参加 の両方を取得
    const { data: memberData } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', userId);

    const memberGroupIds = memberData?.map(m => m.group_id) || [];

    const { data: groups, error } = await supabase
        .from('groups')
        .select('*')
        .or(`owner_id.eq.${userId},id.in.(${memberGroupIds.join(',') || '0'})`);

    if (error) {
        console.error('Get user groups error:', error);
        return [];
    }

    return groups || [];
}

/**
 * グループメンバー一覧を取得（プロフィール付き）
 */
export async function getGroupMembers(groupId: number): Promise<GroupMember[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('group_members')
        .select(`
            *,
            profiles:user_id (
                id,
                full_name,
                grade
            )
        `)
        .eq('group_id', groupId);

    if (error) {
        console.error('Get group members error:', error);
        return [];
    }

    return data || [];
}

/**
 * グループ内ランキングを取得（テスト回数順）
 */
export async function getGroupRanking(groupId: number): Promise<RankingEntry[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    // 1. グループメンバーを取得
    const { data: members } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId);

    if (!members || members.length === 0) return [];

    const userIds = members.map(m => m.user_id);

    // 2. RPC関数でテスト回数を取得（RLSをバイパス）
    const { data: testCounts, error } = await supabase
        .rpc('get_group_member_test_counts', { group_id_param: groupId });

    if (error) {
        console.error('Get ranking error:', error);
        return [];
    }

    // 3. テスト回数マップを作成
    const countMap: Record<string, number> = {};
    testCounts?.forEach((r: { user_id: string; test_count: number }) => {
        countMap[r.user_id] = r.test_count;
    });

    // 4. プロフィール情報を取得
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

    const profileMap: Record<string, string | null> = {};
    profiles?.forEach(p => {
        profileMap[p.id] = p.full_name;
    });

    // 5. ランキングを作成
    const ranking: RankingEntry[] = userIds.map(userId => ({
        user_id: userId,
        full_name: profileMap[userId] || null,
        test_count: countMap[userId] || 0,
        rank: 0
    }));

    // 6. テスト回数でソートして順位を付ける
    ranking.sort((a, b) => b.test_count - a.test_count);
    ranking.forEach((entry, index) => {
        entry.rank = index + 1;
    });

    return ranking;
}

/**
 * 全体ランキングを取得（ユーザーが所属する全グループのメンバー）
 */
export async function getOverallRanking(userId: string): Promise<RankingEntry[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    // 1. ユーザーの所属グループを取得
    const groups = await getUserGroups(userId);
    if (groups.length === 0) return [];

    const groupIds = groups.map(g => g.id);

    // 2. RPC関数でテスト回数を取得（RLSをバイパス）
    const { data: testCounts, error } = await supabase
        .rpc('get_multiple_groups_member_test_counts', { group_ids: groupIds });

    if (error) {
        console.error('Get overall ranking error:', error);
        return [];
    }

    // 3. 重複を排除しつつテスト回数マップを作成
    const countMap: Record<string, number> = {};
    testCounts?.forEach((r: { user_id: string; test_count: number }) => {
        countMap[r.user_id] = r.test_count;
    });

    const uniqueUserIds = Object.keys(countMap);
    if (uniqueUserIds.length === 0) return [];

    // 4. プロフィール情報を取得
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', uniqueUserIds);

    const profileMap: Record<string, string | null> = {};
    profiles?.forEach(p => {
        profileMap[p.id] = p.full_name;
    });

    // 5. ランキングを作成
    const ranking: RankingEntry[] = uniqueUserIds.map(uid => ({
        user_id: uid,
        full_name: profileMap[uid] || null,
        test_count: countMap[uid] || 0,
        rank: 0
    }));

    // 6. テスト回数でソートして順位を付ける
    ranking.sort((a, b) => b.test_count - a.test_count);
    ranking.forEach((entry, index) => {
        entry.rank = index + 1;
    });

    return ranking;
}

/**
 * 新しいグループを作成
 */
export async function createGroup(name: string, ownerId: string): Promise<Group | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const inviteCode = generateInviteCode();

    const { data, error } = await supabase
        .from('groups')
        .insert({
            name,
            invite_code: inviteCode,
            owner_id: ownerId
        })
        .select()
        .single();

    if (error) {
        console.error('Create group error:', error);
        return null;
    }

    // オーナーも自動的にメンバーとして追加
    await supabase
        .from('group_members')
        .insert({
            group_id: data.id,
            user_id: ownerId
        });

    return data;
}

/**
 * グループ名を更新（オーナーのみ）
 */
export async function updateGroup(groupId: number, name: string): Promise<Group | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('groups')
        .update({ name })
        .eq('id', groupId)
        .select()
        .single();

    if (error) {
        console.error('Update group error:', error);
        return null;
    }

    return data;
}
