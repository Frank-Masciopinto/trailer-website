import React, { useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../lib/utils';

/**
 * PDPReviews - Reviews section wrapper
 * Wraps existing BigCommerce reviews content in MCP containers
 * Does not rebuild review engine, just provides styling container
 */
export function PDPReviews({
  product,
  reviewsHtml = '',
  reviewFormHtml = '',
  onWriteReviewClick,
}) {
  const reviewsContainerRef = useRef(null);

  // If reviewsHtml is provided, inject it
  useEffect(() => {
    if (reviewsContainerRef.current && reviewsHtml) {
      reviewsContainerRef.current.innerHTML = reviewsHtml;
    }
  }, [reviewsHtml]);

  // Rating distribution (mock - would come from product.reviews data)
  const getRatingDistribution = () => {
    // This would typically come from product data
    // For now, we'll show a placeholder if reviews exist
    if (!product.num_reviews || product.num_reviews === 0) {
      return null;
    }
    return [
      { stars: 5, percentage: 70, count: Math.floor(product.num_reviews * 0.7) },
      { stars: 4, percentage: 15, count: Math.floor(product.num_reviews * 0.15) },
      { stars: 3, percentage: 8, count: Math.floor(product.num_reviews * 0.08) },
      { stars: 2, percentage: 4, count: Math.floor(product.num_reviews * 0.04) },
      { stars: 1, percentage: 3, count: Math.floor(product.num_reviews * 0.03) },
    ];
  };

  const distribution = getRatingDistribution();
  const hasReviews = product.num_reviews > 0;

  return (
    <div className="tpu-pdp-reviews" id="reviews">
      <Card className="tpu-pdp-reviews__card">
        <CardHeader className="tpu-pdp-reviews__header">
          <div className="tpu-pdp-reviews__header-content">
            <CardTitle className="tpu-pdp-reviews__title">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Customer Reviews
            </CardTitle>
            {hasReviews && (
              <Badge variant="secondary" className="tpu-pdp-reviews__count">
                {product.num_reviews} {product.num_reviews === 1 ? 'review' : 'reviews'}
              </Badge>
            )}
          </div>

          {hasReviews && (
            <div className="tpu-pdp-reviews__summary">
              {/* Overall Rating */}
              <div className="tpu-pdp-reviews__overall">
                <span className="tpu-pdp-reviews__rating-value">
                  {product.rating?.toFixed(1) || '0.0'}
                </span>
                <div className="tpu-pdp-reviews__rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={cn(
                        'tpu-pdp-reviews__star',
                        star <= (product.rating || 0) && 'tpu-pdp-reviews__star--filled'
                      )}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={star <= (product.rating || 0) ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="tpu-pdp-reviews__rating-text">
                  out of 5
                </span>
              </div>

              {/* Rating Distribution */}
              {distribution && (
                <div className="tpu-pdp-reviews__distribution">
                  {distribution.map((item) => (
                    <div key={item.stars} className="tpu-pdp-reviews__distribution-row">
                      <span className="tpu-pdp-reviews__distribution-label">
                        {item.stars} star
                      </span>
                      <div className="tpu-pdp-reviews__distribution-bar">
                        <div
                          className="tpu-pdp-reviews__distribution-fill"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="tpu-pdp-reviews__distribution-count">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <Button
            variant={hasReviews ? 'outline' : 'default'}
            onClick={onWriteReviewClick}
            className="tpu-pdp-reviews__write-btn"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Write a Review
          </Button>
        </CardHeader>

        <CardContent className="tpu-pdp-reviews__content">
          {hasReviews ? (
            // Container for existing reviews content
            <div
              ref={reviewsContainerRef}
              className="tpu-pdp-reviews__list"
              id="product-reviews"
            >
              {/* Reviews will be injected here or rendered by BigCommerce */}
              {!reviewsHtml && (
                <div className="tpu-pdp-reviews__loading">
                  Loading reviews...
                </div>
              )}
            </div>
          ) : (
            // Empty state
            <div className="tpu-pdp-reviews__empty">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <h4>No reviews yet</h4>
              <p>Be the first to share your experience with this product.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review form modal container - existing form will be injected */}
      {reviewFormHtml && (
        <div
          className="tpu-pdp-reviews__form-container"
          id="write_review"
          dangerouslySetInnerHTML={{ __html: reviewFormHtml }}
        />
      )}
    </div>
  );
}

export default PDPReviews;

