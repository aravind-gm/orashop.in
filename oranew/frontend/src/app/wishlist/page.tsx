export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container-luxury">
        <h1 className="text-4xl font-serif font-bold text-text-primary mb-6">
          My Wishlist
        </h1>
        
        <div className="bg-background-white rounded-luxury p-8 shadow-luxury">
          <div className="text-center py-12">
            <svg className="w-24 h-24 mx-auto mb-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-xl font-serif font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-text-muted mb-6">Save your favorite items here!</p>
            <a href="/products" className="btn-primary inline-block">
              Browse Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
