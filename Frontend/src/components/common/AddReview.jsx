import { useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { addReview, editReview } from "../../services/operations/homeApi";
import { useUser } from "../common/UserContext";

function AddReview({ initialReview = null, setIsModalOpen }) {
  const { user, setUser } = useUser();

  const token = user.token;

  const [rating, setRating] = useState(initialReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState(initialReview?.reviewText || "");
  const [hasReviewed, setHasReviewed] = useState(!!initialReview);
  const [loading, setLoading] = useState(false);
  console.log(user);

  const handleSubmit = async () => {
    if (!reviewText.trim()) {
      alert("Please enter a review.");
      return;
    }
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    let response;
    let newReview;

    if (user.review && user.review.rating && user.review.reviewText) {
      // if review has an ID, call edit API
      response = await editReview(
        user.review.reviewId,
        {
          rating,
          comment: reviewText,
        },
        token
      );
      newReview = { reviewId: user.review.reviewId, rating, reviewText };
    } else {
      // else add new review
      response = await addReview({ rating, comment: reviewText }, token);
      newReview = { reviewId: response.reviewId, rating, reviewText };
    }

    if (response.status === "success") {
      setUser((prevUser) => ({
        ...prevUser,
        review: newReview,
      }));

      setIsModalOpen(false);
      setHasReviewed(true);
    }
  };
  const handleMouseMove = (star, event) => {
    const { left, width } = event.target.getBoundingClientRect();
    const x = event.clientX - left;
    const isHalf = x < width / 2;
    setHoverRating(isHalf ? star - 0.5 : star);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-primary-light rounded-lg shadow-lg w-[450px] mx-4 relative">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-3 right-3 text-button hover:text-button-hover"
        >
          <IoClose size={30} />
        </button>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-3 text-text-heading">
            {hasReviewed ? "Edit Your Review" : "Add a Review"}
          </h2>
          <div className="flex flex-col gap-4">
            {/* Star Rating */}
            <div className="flex space-x-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => {
                const isHalfStar =
                  rating === star - 0.5 || hoverRating === star - 0.5;
                return (
                  <div
                    key={star}
                    className="cursor-pointer relative"
                    onMouseMove={(e) => handleMouseMove(star, e)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(hoverRating || star)}
                    style={{
                      width: "30px",
                      height: "30px",
                      position: "relative",
                    }}
                  >
                    <FaStar
                      size={30}
                      className="absolute top-0 left-0 text-gray-300"
                      style={{ zIndex: 1 }}
                    />
                    {isHalfStar ? (
                      <FaStarHalfAlt
                        size={30}
                        className="absolute top-0 left-0 text-yellow-500"
                        style={{ zIndex: 2 }}
                      />
                    ) : rating >= star || hoverRating >= star ? (
                      <FaStar
                        size={30}
                        className="absolute top-0 left-0 text-yellow-500"
                        style={{ zIndex: 2 }}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Review Input */}
            <textarea
              className="w-full p-2 text-text-body bg-primary-dark border border-button outline-none rounded-lg focus:ring-2 focus:ring-button-hover"
              rows="4"
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            {/* Submit Button */}
            <button
              className="flex self-end cursor-pointer w-full sm:w-auto items-center justify-center mt-4 px-6 py-2 bg-button text-white rounded-lg hover:bg-button-hover transition"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : hasReviewed
                ? "Save Review"
                : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddReview;
