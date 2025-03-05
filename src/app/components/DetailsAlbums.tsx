import { FaEye } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
type ALbumState = {
    views: number | undefined;
    following: number | undefined;
};

export function AlbumStats({ views, following }: ALbumState)
{
    return (

        <div className="flex items-center gap-2 text-sm">
            <span className="flex bg-purple-700 px-2 rounded-lg items-center gap-1">
                <FaEye />
                {views ?? 0}
            </span>
            <span className="flex bg-red-700 rounded-lg  px-2 items-center gap-1">
                <CiBookmark />
                {following ?? 0}
            </span>
        </div>
    )
        ;
}
export function AlbumsCategories({ item })
{
    return (
        <>
            {Array.isArray(item.categories) && item.categories.length > 0 ? (
                <>
                    {item.categories.slice(0, 3).map((category, index) => (
                        <span key={index} className="text-sm px-2 bg-color_puppy">{category.name}</span>
                    ))}

                    {item.categories.length > 3 && (
                        <span className="text-sm px-2 bg-color_puppy">...</span>
                    )}
                </>
            ) : (
                <span className="text-sm text-gray-500">Không có danh mục</span>
            )}
        </>
    );
}
