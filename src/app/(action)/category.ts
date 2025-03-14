import { supabase } from '../../lib/supabaseClient';
export const getCategories = async () =>
{
    const categoriesResponse = await supabase
        .from("categories")
        .select("*");
    if (categoriesResponse.error) throw categoriesResponse.error;
    return categoriesResponse.data;
};
