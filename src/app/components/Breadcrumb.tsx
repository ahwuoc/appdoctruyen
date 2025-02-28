import Link from 'next/link';

type BreadcrumbProps = {
  items: { label: string; href: string }[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <h2 className="lg:text-xl lg:p-4 text-color_white">
      <nav aria-label="Breadcrumb">
        <ol className="flex space-x-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {index === items.length - 1 ? (
                <span className="text-gray-500">{item.label}</span>
              ) : (
                <Link href={item.href} className=" hover:underline">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </h2>
  );
}