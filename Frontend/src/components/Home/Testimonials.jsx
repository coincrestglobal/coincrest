import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import AddReview from "../common/AddReview";
import { useUser } from "../common/UserContext";
import { useSwipeable } from "react-swipeable";
import { getHomeReviews } from "../../services/operations/homeApi";
import Avatar from "../common/Avatar";
import useSafeNavigate from "../../utils/useSafeNavigate";
import Loading from "../../pages/Loading";

export default function reviewslider() {
  const navigate = useSafeNavigate();
  const { user } = useUser();

  const [reviews, setReviews] = useState([]);
  const [index, setIndex] = useState(0);
  const [reviewModal, setReviewModal] = useState(false);
  const [lodading, setLoading] = useState(true);
  let hasUserReviewed;

  const next = () => setIndex((prev) => (prev + 1) % reviews.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    setLoading(true);
    const getReviews = async () => {
      const token = user?.token;
      const response = await getHomeReviews(token);
      hasUserReviewed = response.data.hasUserReviewed;
      setReviews(response.data.reviews);
    };
    setLoading(false);
    getReviews();
  }, []);

  // Inside your component:
  const handlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => prev(),
    trackMouse: true, // Optional: also enable mouse drag for desktop testing
  });

  const handleClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      setReviewModal(true);
    }
  };

  if (lodading) {
    return <Loading />;
  }
  return (
    <div className="py-8 px-4 sm:px-12 md:px-32 relative">
      <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-heading  flex items-center justify-center gap-3 sm:gap-5">
        <span className="text-text-highlighted text-4xl  md:text-6xl">««</span>
        <span className="text-text-heading text-2xl sm:text-3xl md:text-4xl tracking-tight pt-1 md:pt-2">
          What Our Users Say
        </span>
        <span className="text-text-highlighted text-4xl sm:text-5xl md:text-6xl">
          »»
        </span>
      </h1>
      {reviews.length > 0 && (
        <div
          {...handlers} // Attach swipe handlers here
          className="backdrop-blur-sm text-text-heading py-12 sm:py-16 flex items-center justify-center relative min-h-[22rem] md:min-h-[21rem]"
        >
          <div className="max-w-xl sm:max-w-2xl text-center px-4 sm:px-6 relative">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-3">
                {reviews[index].user?.profilePicUrl ? (
                  <Avatar
                    size={48}
                    imageURL={`${
                      import.meta.env.VITE_BACKEND_URL
                    }/uploads/profilePics/${reviews[index].user.profilePicUrl}`}
                  />
                ) : (
                  <Avatar
                    size={48}
                    bgColor="bg-primary-dark"
                    textColor="text-text-heading"
                    textSize="text-xl"
                    fontWeight="font-semibold"
                    fullName={reviews[index].user?.name || "Anonymous"}
                  />
                )}
              </div>

              <p className="font-semibold text-lg">
                {reviews[index].user?.name}
              </p>

              <p className="text-lg sm:text-xl mb-3 text-text-body px-2 sm:px-0">
                "{reviews[index].comment}"
              </p>

              <p className="text-sm text-text-highlighted font-semibold flex items-center justify-center gap-1">
                {Array.from({ length: 5 }, (_, i) =>
                  i < Math.floor(reviews[index].rating) ? (
                    <FaStar key={i} className="text-yellow-500" />
                  ) : i < reviews[index].rating ? (
                    <FaStarHalfAlt key={i} className="text-yellow-500" />
                  ) : (
                    <FaRegStar key={i} className="text-yellow-500" />
                  )
                )}
                ({reviews[index].rating}/5)
              </p>
            </motion.blockquote>

            {/* Dots */}
            <div className="flex justify-center gap-3 items-center mt-8">
              {reviews.map((_, i) => (
                <span
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === index ? "bg-white" : "bg-gray-500"
                  }`}
                ></span>
              ))}
            </div>

            {/* Navigation arrows */}
            <button
              onClick={prev}
              className="hidden md:block md:absolute md:-left-44 md:top-1/2 md:-translate-y-1/2 md:p-3 md:border md:border-white md:rounded-full md:hover:bg-white md:hover:text-black md:transition-all"
              aria-label="Previous testimonial"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={next}
              className="hidden md:block md:absolute md:-right-44 md:top-1/2 md:-translate-y-1/2 md:p-3 md:border md:border-white md:rounded-full md:hover:bg-white md:hover:text-black md:transition-all"
              aria-label="Next testimonial"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Add Review Button */}
      {user.role === "user" && (
        <div className="py-4 flex justify-center">
          <button
            className="bg-button text-text-heading font-semibold py-2 px-6 rounded-md shadow-md hover:scale-105 transition w-full max-w-xs sm:max-w-none sm:w-auto"
            onClick={handleClick}
          >
            {!hasUserReviewed ? "Edit Your Review" : "Add Your Review"}
          </button>
        </div>
      )}

      {/* Add Review Modal */}
      {reviewModal && (
        <AddReview initialReview={review} setIsModalOpen={setReviewModal} />
      )}
    </div>
  );
}
