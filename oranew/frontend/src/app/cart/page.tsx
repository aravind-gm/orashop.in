export default function CartPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container-luxury">
        <h1 className="text-4xl font-serif font-bold text-text-primary mb-6">
          Shopping Cart
        </h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 bg-background-white rounded-luxury p-8 shadow-luxury">
            <div className="text-center py-12">
              <svg className="w-24 h-24 mx-auto mb-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h2 className="text-xl font-serif font-semibold mb-2">Your cart is empty</h2>
              <p className="text-text-muted mb-6">Start adding some beautiful jewellery to your cart!</p>
              <a href="/products" className="btn-primary inline-block">
                Browse Products
              </a>
            </div>
          </div>
          
          {/* Cart Summary */}
          <div className="bg-background-white rounded-luxury p-8 shadow-luxury h-fit">
            <h2 className="text-xl font-serif font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-text-muted">Subtotal</span>
                <span className="font-medium">₹0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Shipping</span>
                <span className="font-medium">₹0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Tax</span>
                <span className="font-medium">₹0.00</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹0.00</span>
              </div>
            </div>
            <button className="btn-primary w-full" disabled>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
