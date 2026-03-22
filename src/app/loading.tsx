export default function Loading() {
    return (
        <div className="fixed inset-0 bg-mimi-dark/80 backdrop-blur-md flex items-center justify-center z-[9999]">
            <div className="bg-mimi-deep p-8 rounded-[32px] border border-mimi-border shadow-2xl flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-mimi-muted/20 border-t-mimi-blue rounded-full animate-spin shadow-[0_0_20px_rgba(37,99,235,0.3)]"></div>
                <p className="mt-4 text-mimi-muted text-sm font-black uppercase tracking-widest italic animate-pulse">mimi is loading...</p>
            </div>
        </div>
    );
}