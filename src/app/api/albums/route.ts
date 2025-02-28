import { NextResponse } from 'next/server';
import {supabase} from '@/lib/supabaseClient';

export async function GET(){
    const {data,error} = await supabase.from('albums').select("*,chapters(*)");
    if(error) return NextResponse.json({message:`${error.message}`} , {status:500}  );
    return NextResponse.json({data})
}