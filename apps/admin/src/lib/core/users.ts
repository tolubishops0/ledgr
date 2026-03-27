'use server'

import type { UserStatus } from '@ledgr/types'
import { createAdminClient } from '../supabase/admin'

export async function updateUserStatusAction(userId: string, status: UserStatus) {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId)
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export const getAllUsers = async () => {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
}

export const getAllTransactions = async () => {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('transactions')
        .select('*, category:categories(*), profile:profiles(full_name, email, avatar_url)')
        .order('date', { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
}
