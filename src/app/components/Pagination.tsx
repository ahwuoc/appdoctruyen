import { Button } from '@/components/ui/button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
    pagelimit: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, pagelimit }) => {
    const lastPage = totalPages;
    const startPage = Math.max(currentPage - Math.floor(pagelimit / 2), 1);
    const endPage = Math.min(startPage + pagelimit - 1, totalPages);
    const visiblePages = [...Array(totalPages)].map((_, index) => index + 1).slice(startPage - 1, endPage);

    return (
        <div className="pagination py-4 w-full gap-1 flex items-center justify-center">
            <Button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </Button>

            {visiblePages.map((page) => (
                <Button
                    key={page}
                    className={`hover:bg-customBg2 ${currentPage === page ? "bg-customBg2" : ""}`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </Button>
            ))}

            {endPage < totalPages && (
                <>
                    <span className="px-2">...</span>
                    <Button
                        className={`hover:bg-customBg2 ${currentPage === lastPage ? "bg-customBg2" : ""}`}
                        onClick={() => onPageChange(lastPage)}
                    >
                        {lastPage}
                    </Button>
                </>
            )}

            <Button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
           &gt;
            </Button>
        </div>
    );
};

export default Pagination;
