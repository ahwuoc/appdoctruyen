"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getUsers() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching users:", error);
        return [];
    }
    return data;
}

export async function getAllUsersIncludeDeleted() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching all users:", error);
        return [];
    }
    return data;
}

export async function updateUserRole(userId: string, role: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", userId);

    if (error) throw error;
    revalidatePath("/manager/users");
    return { success: true };
}

export async function updateUserStatus(userId: string, status: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        .update({ status })
        .eq("id", userId);

    if (error) throw error;
    revalidatePath("/manager/users");
    return { success: true };
}

export async function softDeleteUser(userId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        .update({
            deleted_at: new Date().toISOString(),
            status: "DELETED"
        })
        .eq("id", userId);

    if (error) throw error;
    revalidatePath("/manager/users");
    return { success: true };
}

export async function restoreUser(userId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        .update({
            deleted_at: null,
            status: "ACTIVE"
        })
        .eq("id", userId);

    if (error) throw error;
    revalidatePath("/manager/users");
    return { success: true };
}

export async function hardDeleteUser(userId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

    if (error) throw error;
    revalidatePath("/manager/users");
    return { success: true };
}
