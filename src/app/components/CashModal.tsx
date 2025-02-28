'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
export function CashModal() {
  return (
    <Dialog>
      <DialogTrigger className="flex w-32 rounded-xl shadow-md">
        <div className="w-full flex gap-0.5 items-stretch">
          <div className="flex p-1 container gap-2 items-center flex-2 rounded-l-xl bg-opacity-40 bg-gray-600">
            <Image src="https://cmangag.com/assets/img/user/currency/manga_coin.png" alt="Manga Coin" width={30} height={20} />
            <span>0</span>
          </div>
          <div className="flex p-2  rounded-r-xl bg-opacity-40  bg-gray-600">
            <span>+</span>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
