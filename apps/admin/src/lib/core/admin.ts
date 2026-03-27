import { createAdminClient } from "../supabase/admin"

export const getAdminStats = async () => {
    const supabase = createAdminClient()

    const [
        { count: totalUsers },
        { count: activeUsers },
        { count: totalTransactions },
        { data: transactions },
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('transactions').select('*', { count: 'exact', head: true }),
        supabase.from('transactions').select('amount'),
    ])

    const volume = transactions?.reduce((s, t) => s + t.amount, 0) ?? 0

    return {
        totalUsers: totalUsers ?? 0,
        activeUsers: activeUsers ?? 0,
        totalTransactions: totalTransactions ?? 0,
        volume,
    }
}

export const getRecentSignups = async () => {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
    if (error) throw new Error(error.message)
    return data ?? []
}

export const getAdminAnalytics = async () => {
    const supabase = createAdminClient()

    const [
        { data: users },
        { data: transactions },
    ] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: true }),
        supabase.from('transactions').select('*, profile:profiles(id, full_name, email, avatar_url)'),
    ])

    return {
        users: users ?? [],
        transactions: transactions ?? [],
    }
}