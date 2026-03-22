"use server";

import { createClient } from "@/lib/supabase/server";
import { LoginInput, RegisterInput } from "@/lib/schema/schema-auth";

export const loginUserAction = async (data: LoginInput) => {
    try {
        const supabase = await createClient();

        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) throw new Error(error.message);
        const { data: profile } = await supabase
            .from("profiles")
            .select("role, username")
            .eq("id", authData.user.id)
            .single();

        if (profile) {
            await supabase.auth.updateUser({
                data: { role: profile.role, username: profile.username }
            });
        }

        return { success: true, user: { ...authData.user, ...profile } };
    } catch (error: any) {
        console.error("Login Error:", error.message);
        return { success: false, error: error.message };
    }
};

export const registerUserAction = async (data: RegisterInput) => {
    try {
        const supabase = await createClient();

        // 1. Sign up user with default role USER
        const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    username: data.username,
                    role: "USER"
                }
            }
        });

        if (error) throw new Error(error.message);
        if (!authData.user) throw new Error("Không thể tạo tài khoản");

        // 2. Map to profiles table
        const { error: profileError } = await supabase.from("profiles").upsert({
            id: authData.user.id,
            username: data.username,
            role: "USER"
        });

        if (profileError) console.warn("Lỗi tạo profile:", profileError.message);

        return { success: true, user: authData.user };
    } catch (error: any) {
        console.error("Register Error:", error.message);
        return { success: false, error: error.message };
    }
};

export const logoutUserAction = async () => {
    try {
        const supabase = await createClient();
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error("Logout Error:", error.message);
        return { success: false };
    }
};

export const getCurrentUserRole = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    return profile?.role || "USER";
};
