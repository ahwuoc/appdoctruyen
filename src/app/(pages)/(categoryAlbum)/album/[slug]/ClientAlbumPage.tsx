"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CiWifiOn, CiBoxList } from "react-icons/ci";
import { AiOutlineSync } from "react-icons/ai";
import { FaEye, FaBookmark } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import CommentComponents from "@/app/components/CommentComponents";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { timeAgo, createSlug } from "@/lib/utils";
