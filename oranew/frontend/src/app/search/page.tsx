export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container-luxury">
        <h1 className="text-4xl font-serif font-bold text-text-primary mb-6">
          Search Products
        </h1>
        
        <div className="bg-background-white rounded-luxury p-8 shadow-luxury">
          <div className="mb-8">
            <div className="relative">
              <input 
                type="text" 
                className="input-luxury pl-12" 
                placeholder="Search for jewellery..."
              />
              <svg className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="text-center py-12">
            <p className="text-text-muted">Enter a search term to find products</p>
          </div>
        </div>
      </div>
    </div>
  );
}
