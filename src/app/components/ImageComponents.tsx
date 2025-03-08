import Image from 'next/image';


interface ImageType
{
    src: string;
    name: string;
}

export default function ImageComponents({ image }: { image: ImageType; })
{

    return (
        <Image src={image.src.trim() ?? "https://imgs.search.brave.com/2-NODWKga4v8RuXvhMpR7XJ6QYcYOZDRYmCCnNYRHDQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lYXNp/bWFnZXMuYmFzbm9w/LmNvbS9kZWZhdWx0/LWltYWdlXzYwMC5w/bmc"} alt={image.name} width={100} draggable={false} height={100}
            className='w-full h-full object-cover'
        />
    );
}
