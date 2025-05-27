import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { FaTrash } from "react-icons/fa";
import StarRatings from "react-star-ratings";
import ConfirmationModal from "../../../common/ConfirmationModal";
import { useUser } from "../../../common/UserContext";
import useSafeNavigate from "../../../../utils/useSafeNavigate";
import { getReviewById } from "../../../../services/operations/adminAndOwnerDashboardApi";

const ReviewDetails = () => {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useSafeNavigate();
  const [acceptModal, setAcceptModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    reviewId: null,
  });
  const [review, setReview] = useState([]);

  useEffect(() => {
    const fetchReview = async () => {
      const response = await getReviewById(user.token, id);
      setReview(response.data.review);
    };
    fetchReview();
    clg("Fetching review with ID:");
  }, []);

  const handleAccept = async (reviewId) => {
    // try {
    //   await axios.patch(`/api/v1/reviews/${reviewId}/approve`);
    //   toast.success("Review approved!");
    //   // Optionally: Refresh list
    // } catch (error) {
    //   toast.error("Failed to approve review.");
    // } finally {
    //   setAcceptModal(false);
    // }
  };

  const handleDelete = (id) => {
    setDeleteConfirm({ show: true, reviewId: id });
  };

  const confirmDelete = async () => {};

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, reviewId: null });
  };
  console.log(review);
  return (
    <div className="p-6 space-y-6 bg-primary-dark text-text-heading rounded-md shadow h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-heading">Review Details</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-button hover:bg-button-hover text-text-heading rounded-md transition"
        >
          Go Back
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-4 p-4 bg-primary border border-button rounded-md shadow">
        <div className="space-y-2">
          <p className="text-text-body">
            <span className="font-semibold text-button">Name:</span>{" "}
            {review.user.name}
          </p>
          <p className="text-text-body">
            <span className="font-semibold text-button">Email:</span>{" "}
            {review.user.email}
          </p>

          <div className="flex items-center gap-2 text-text-body">
            <span className="font-semibold text-button">Rating:</span>{" "}
            <StarRatings
              rating={4}
              starRatedColor="yellow"
              numberOfStars={5}
              starDimension="18px"
              starSpacing="2px"
              name="rating"
            />
          </div>
        </div>
      </div>

      {/* Review Message */}
      <div className="p-4 bg-primary border border-button rounded-md shadow">
        <h3 className="text-button font-semibold mb-2">Review Message</h3>
        <p className="text-gray-300">{review.comment}</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          className="bg-button px-4 py-2 rounded-lg"
          onClick={() => setAcceptModal(true)}
        >
          Accept
        </button>
        <button
          onClick={() => handleDelete(review.id)}
          disabled={deleteConfirm.reviewId === review.id}
          className={`flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-text-heading rounded-lg transition ${
            deleteConfirm.reviewId === review.id
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <FaTrash size={16} /> Delete
        </button>
      </div>

      {acceptModal && (
        <ConfirmationModal
          text={
            "Are you sure you want to approve this review? This action will make it visible to all users."
          }
          onConfirm={() => handleAccept(review.id)}
          onCancel={() => setAcceptModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#1e293b] p-6 rounded-lg shadow-lg border border-button w-[90%] max-w-md">
            <p className="mb-6 text-text-heading font-medium text-lg text-center">
              Are you sure you want to delete this review?
            </p>
            <div className="flex justify-center gap-6">
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-text-heading rounded-lg"
                onClick={confirmDelete}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-text-heading rounded-lg"
                onClick={cancelDelete}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewDetails;
