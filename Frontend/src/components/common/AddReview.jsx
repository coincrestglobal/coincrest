import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { addReview, editReview } from "../../services/operations/homeApi";
import { useUser } from "../common/UserContext";

function AddReview({ initialReview = null, setIsModalOpen }) {
  const { user } = useUser();
  const token = user?.token;

  const [rating, setRating] = useState(initialReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState(initialReview?.comment || "");
  const [hasReviewed, setHasReviewed] = useState(!!initialReview);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let response;
      if (initialReview) {
        response = await editReview(
          initialReview._id,
          { rating, comment: reviewText },
          token
        );
      } else {
        response = await addReview({ rating, comment: reviewText }, token);
      }

      setHasReviewed(true);
      setIsModalOpen(false);
    } catch (error) {
      // handle error if needed
    } finally {
      setLoading(false);
    }
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
            <div className="flex space-x-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => {
                return (
                  <div
                    key={star}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    style={{ width: "30px", height: "30px" }}
                  >
                    <FaStar
                      size={30}
                      className={
                        hoverRating >= star || rating >= star
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  </div>
                );
              })}
            </div>

            <textarea
              className="w-full p-2 text-text-body bg-primary-dark border border-button outline-none rounded-lg focus:ring-2 focus:ring-button-hover"
              rows="4"
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

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
