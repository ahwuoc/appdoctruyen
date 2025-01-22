"use client";
import React , { Provider ,createContext , ReactNode } from "react";

interface Chapter {
    id:number,
    name:string,
    view:number,

}

interface ChapterContextType {
    chapters: Chapter[],
    setChapters:(chapter: Chapter[]) => void,
}