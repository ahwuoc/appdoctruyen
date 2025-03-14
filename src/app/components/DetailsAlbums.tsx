import { FaEye } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { AlbumType, CategoryType } from '../../lib/type';
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
export function AlbumsCategories({ item }: { item: AlbumType; })
{
    return (
        <>
            {Array.isArray(item.categories) && item.categories.length > 0 ? (
                <>
                    {item.categories.slice(0, 3).map((category: CategoryType, index: number) => (
                        <span key={index} className="text-sm truncate p-2 mx-1 rounded-md text-color_white  bg-color_puppy">{category.title}</span>
                    ))}
                    {item.categories.length > 3 && (
                        <span className="text-sm px-2 p-2 text-color_white rounded-md bg-color_puppy">...</span>
                    )}
                </>
            ) : (
                <span className="text-sm text-gray-500">Cập nhật</span>
            )}
        </>
    );
}
