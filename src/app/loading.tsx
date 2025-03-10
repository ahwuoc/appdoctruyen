export default function Loading()
{
    return (
        <div className="fixed  inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
                <p className="mt-3 text-gray-700 text-lg font-medium">Đang tải dữ liệu...</p>
            </div>
        </div>
    );
}