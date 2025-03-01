

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(array: any) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateRandomAlbum(id: number) {
    const names = ["Hành trình huyền thoại", "Ký ức mùa đông", "Quy Hoàn Lục Ma Đạo", "Bí mật đại dương", "Hỏa ngục và thiên đường"];
    const descriptions = ["Một câu chuyện đầy kịch tính.", "Hành trình tìm lại chính mình.", "Cuộc phiêu lưu đến nơi xa xôi."];
    const tags = ["hành động", "phiêu lưu", "viễn tưởng", "tình cảm", "hài hước"];
    const images = [
        "https://cmangax.com/assets/tmp/album/49059.png?v=1707892564",
        "https://cmangax.com/assets/tmp/album/82486.png?v=1738905865",
        "https://cmangax.com/assets/tmp/album/186.png?v=1694770581",
        "https://cmangax.com/assets/tmp/album/82199.webp?v=1738394315",
        "https://cmangax.com/assets/tmp/album/83154.webp?v=1740106516",
        "https://cmangax.com/assets/tmp/album/82931.webp?v=1739771847",
        "https://cmangax.com/assets/tmp/album/62141.png?v=1729342811",
        "https://cmangax.com/assets/tmp/album/39155.png?v=1700030183"
    ];

    const categories = [
        { id: 1, name: "Manga" },
        { id: 2, name: "Manhwa" },
        { id: 3, name: "Manhua" },
        { id: 4, name: "Tiểu thuyết" },
        { id: 5, name: "Action" },
        { id: 6, name: "Tối thượng" },
        { id: 7, name: "Fantasy" },
        { id: 8, name: "Horror" },
        { id: 9, name: "Comedy" },
        { id: 10, name: "Romance" },
        { id: 11, name: "Sci-Fi" },
        { id: 12, name: "Adventure" },
        { id: 13, name: "Drama" },
        { id: 14, name: "Shounen" },
        { id: 15, name: "Shoujo" },
        { id: 16, name: "Seinen" },
        { id: 17, name: "Josei" },
        { id: 18, name: "Slice of Life" },
        { id: 19, name: "Mystery" },
        { id: 20, name: "Psychological" }
    ];

    return {
        id: id,
        name: getRandomElement(names),
        description: getRandomElement(descriptions),
        image: getRandomElement(images),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
        follow: getRandomInt(100, 10000),
        tags: Array.from({ length: getRandomInt(2, 5) }, () => getRandomElement(tags)),
        categories: Array.from({ length: getRandomInt(1, 4) }, () => getRandomElement(categories)),
        chapters: Array.from({ length: getRandomInt(5, 20) }, (_, i) => ({
            id: i + 1,
            view: getRandomInt(1, 20000),
            name: `Chương ${i + 1}`,
            created_at: new Date().toISOString(),
            sort_order: i + 1
        }))
    };
}



export default function generateMockupData(count: number) {
    return Array.from({ length: count }, (_, i) => generateRandomAlbum(i + 1));
}

