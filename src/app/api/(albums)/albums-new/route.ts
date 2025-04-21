import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabaseClient";

export async function GET() {
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .order("id", { ascending: false })
    .limit(16);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
