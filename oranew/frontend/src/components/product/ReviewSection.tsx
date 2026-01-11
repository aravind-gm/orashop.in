import { MessageCircle, Star } from 'lucide-react';

interface ReviewSectionProps {
  averageRating?: number;
  reviewCount?: number;
  productId?: string;
}

export default function ReviewSection({
  averageRating = 4.5,
  reviewCount = 24,
}: ReviewSectionProps) {
  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-start gap-8">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">
              {reviewCount} verified purchases
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="flex-1 space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 w-12">
                  {stars} star
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width: `${(Math.random() * 100).toFixed(0)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write Review CTA */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <MessageCircle className="mx-auto mb-3 text-gray-400" size={32} />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Your Experience</h3>
        <p className="text-gray-600 mb-4">
          Have you used this product? Share your feedback to help other customers.
        </p>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Write a Review
        </button>
      </div>

      {/* Reviews List Placeholder */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-900">Verified Buyer</p>
                    <p className="text-sm text-gray-600">2 weeks ago</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <div className="h-12 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
