export default function ProductsLoading() {
    return  (
        <div aria-busy="true">
            <span className="sr-only">Loading products</span>

            <div className="grid">
                {Array.from({ length: 6}).map((_, i) => (
                    <div key={i} className="skeleton-row"/>
                ))}
            </div>
        </div>
    );
}