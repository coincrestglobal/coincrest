import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { FaTrash } from "react-icons/fa";
import StarRatings from "react-star-ratings";

const ReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSuspending, setIsSuspending] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [isSuspended, setIsSuspended] = useState(false);
  const [suspendUntil, setSuspendUntil] = useState("");
  const [isMailing, setIsMailing] = useState(false);
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    reviewId: null,
  });

  const review = {
    id,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    numberOfreviews: 5,
    lastVisit: "2025-03-20",
    lastreview: "Cultural Exploration",
    reviewList: [
      { id: "101", name: "Safari Adventure" },
      { id: "102", name: "Mountain Hike" },
      { id: "103", name: "City review" },
      { id: "104", name: "Beach Holiday" },
      { id: "105", name: "Cultural Exploration" },
    ],
    status: isSuspended ? "Suspended" : "Active",
  };

  const handleDelete = (id) => {
    setDeleteConfirm({ show: true, reviewId: id });
  };

  const confirmDelete = () => {
    setDeleteConfirm({ show: false, reviewId: null });
    // deletion logic here
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, reviewId: null });
  };

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

      <div className="grid grid-cols-2 gap-4 p-4 bg-primary border border-button rounded-md shadow">
        <div>
          <p className="text-text-body">
            <span className="font-semibold text-button">Review ID:</span>{" "}
            {review.id}
          </p>
          <p className="text-text-body">
            <span className="font-semibold text-button">Name:</span>{" "}
            {review.name}
          </p>
          <p className="text-text-body">
            <span className="font-semibold text-button">Email:</span>{" "}
            {review.email}
          </p>
          <p className="text-text-body">
            <span className="font-semibold text-button">Phone:</span>{" "}
            {review.phone}
          </p>
          <p className="text-text-body">
            <span className="font-semibold text-button">Total Reviews:</span>{" "}
            {review.numberOfreviews}
          </p>
        </div>
        <div>
          <p className="text-text-body">
            <span className="font-semibold text-button">Last Visit:</span>{" "}
            {review.lastVisit}
          </p>
          <p className="text-text-body">
            <span className="font-semibold text-button">Last Review:</span>{" "}
            {review.lastreview}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-semibold text-button">Rating:</span>{" "}
            <StarRatings
              rating={4}
              starRatedColor="yellow"
              numberOfStars={5}
              starDimension="18px"
              starSpacing="2px"
              name="rating"
            />
          </p>
          <p className="py-1">
            <span className="font-semibold text-button">Status:</span>{" "}
            <span className="px-2 py-1 text-sm bg-button text-text-heading rounded-md">
              {review.status}
            </span>
          </p>
        </div>
      </div>

      <div className="p-4 bg-primary border border-button rounded-md shadow">
        <h3 className="text-button font-semibold mb-2">Review Message</h3>
        <p className="text-gray-300">
          I've updated the main review page to display the review's name, email,
          a truncated review (first three words followed by "..."), and the
          date. Clicking on a review now navigates to another page (/review/:id)
          where full details can be shown.
        </p>
      </div>
      <div className="flex gap-4">
        <button className="bg-button px-4 py-2 rounded-lg">Accept</button>
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

      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#1e293b] p-8 rounded-lg shadow-lg border border-button">
            <p className="mb-6 text-text-heading font-medium text-lg">
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
