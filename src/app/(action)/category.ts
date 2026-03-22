"use server";

import { supabase } from "@/lib/supabase/supabaseClient";
import { revalidatePath } from "next/cache";

export const getCategories = async () => {
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("id", { ascending: true });

    if (error) throw error;
    return data;
};

export const createCategory = async (title: string, content?: string) => {
    const { data, error } = await supabase
        .from("categories")
        .insert([{ title, content }])
        .select();

    if (error) throw error;
    revalidatePath("/manager/categories");
    return data;
};

export const updateCategory = async (id: number, title: string, content?: string) => {
    const { data, error } = await supabase
        .from("categories")
        .update({ title, content })
        .eq("id", id)
        .select();

    if (error) throw error;
    revalidatePath("/manager/categories");
    return data;
};

export const deleteCategory = async (id: number) => {
    const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

    if (error) throw error;
    revalidatePath("/manager/categories");
};
