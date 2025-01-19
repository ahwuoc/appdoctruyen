"use client"
import * as React from "react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Category = {
  id: number
  name: string
}

export function DropdownMenuCheckboxes() {
  const [categories, setCategories] = React.useState<Category[]>([])
  const [checkedItems, setCheckedItems] = React.useState<Set<number>>(new Set())
  
  const FakeData = [
    { id: 1, name: "Chuyển sinh" },
  { id: 2, name: "Hành động" },
  { id: 3, name: "Phiêu lưu" },
  { id: 4, name: "Khoa học viễn tưởng" },
  { id: 5, name: "Lãng mạn" },
  { id: 6, name: "Hài hước" },
  { id: 7, name: "Kinh dị" },
  { id: 8, name: "Thần thoại" },
  { id: 9, name: "Tâm lý" },
  { id: 10, name: "Học đường" },
  { id: 11, name: "Trinh thám" },
  { id: 12, name: "Cuộc sống" },
  { id: 13, name: "Thể thao" },
  { id: 14, name: "Âm nhạc" },
  { id: 15, name: "Phim cổ trang" },
  { id: 16, name: "Gia đình" },
  { id: 17, name: "Xã hội" },
  { id: 18, name: "Lịch sử" },
  { id: 19, name: "Văn học" },
  { id: 20, name: "Chiến tranh" },
  { id: 21, name: "Mạo hiểm" },
  { id: 22, name: "Tương lai" }
    
  ]

  useEffect(() => {
    const getListCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data: Category[] = await response.json()
        setCategories(data)
      } catch (error) { 
        console.error("Error fetching categories", error)
        setCategories(FakeData)
      }
    }
    getListCategories()
  }, [])

  const handleCheckBoxAll = () => {
    setCheckedItems(new Set())
  }

  const handleCheckboxChange = (id: number) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = new Set(prevCheckedItems)
      if (newCheckedItems.has(id)) {
        newCheckedItems.delete(id)
      } else {
        newCheckedItems.add(id)
      }
      return newCheckedItems
    })
  }

  return (
    <DropdownMenu  >
      <DropdownMenuTrigger  asChild>
        <Button  variant="outline">Tất cả</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem  onClick={handleCheckBoxAll}>
          Tất cả 
        </DropdownMenuCheckboxItem>
        {categories.length > 0 ? (
          categories.map((category) => (
            <DropdownMenuCheckboxItem
              key={category.id}
              checked={checkedItems.has(category.id)}
              onCheckedChange={() => handleCheckboxChange(category.id)}
            >
              {category.name}
            </DropdownMenuCheckboxItem>
          ))
        ) : (
          <DropdownMenuCheckboxItem disabled>
            Không tìm thấy danh mục nào.
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
