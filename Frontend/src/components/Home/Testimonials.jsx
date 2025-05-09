import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import AddReview from "../common/AddReview";
import { useUser } from "../common/UserContext";
const testimonialsInitial = [
  {
    quote:
      "CoinCrest has transformed my staking experience! The platform is user-friendly and incredibly rewarding.",
    name: "Alex Johnson",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
  },
  {
    quote:
      "I've seen significant gains since switching to CoinCrest. It's intuitive and secure.",
    name: "Sarah Lee",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.5,
  },
];

export default function TestimonialSlider() {
  const { user, setUser } = useUser();
  const [testimonials, setTestimonials] = useState(testimonialsInitial);
  const [index, setIndex] = useState(0);
  const [reviewModal, setReviewModal] = useState(false);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const submitReview = (newReview) => {
    setUser((prevUser) => ({
      ...prevUser,
      review: newReview.review,
      rating: newReview.rating,
    }));
    setReviewModal(false);
  };

  return (
    <div className="py-8 px-4 sm:px-12 md:px-32 relative">
      <h1 className="text-text-heading text-3xl sm:text-4xl font-bold flex justify-center items-center gap-4 drop-shadow-lg mb-8">
        <span className="text-button text-4xl sm:text-5xl">««</span>
        <span className="text-heading">What Our Users Say</span>
        <span className="text-button text-4xl sm:text-5xl">»»</span>
      </h1>

      <div className="backdrop-blur-sm text-text-heading py-16 flex items-center justify-center relative">
        <div className="max-w-2xl text-center px-6">
          <motion.blockquote
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-2">
              <img
                src={testimonials[index].image}
                alt={testimonials[index].name}
                className="w-12 h-12 rounded-full border-2 border-text-linkHover"
              />
            </div>
            <p className="font-semibold">{testimonials[index].name}</p>
            <p className="text-xl mb-2 text-text-body">
              "{testimonials[index].quote}"
            </p>
            <p className="text-sm text-text-highlighted font-semibold flex items-center justify-center gap-1">
              {Array.from({ length: 5 }, (_, i) =>
                i < Math.floor(testimonials[index].rating) ? (
                  <FaStar key={i} className="text-yellow-500" />
                ) : i < testimonials[index].rating ? (
                  <FaStarHalfAlt key={i} className="text-yellow-500" />
                ) : (
                  <FaRegStar key={i} className="text-yellow-500" />
                )
              )}
              ({testimonials[index].rating}/5)
            </p>
          </motion.blockquote>

          <div className="flex justify-center gap-2 items-center mt-8">
            {testimonials.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === index ? "bg-white" : "bg-gray-500"
                }`}
              ></span>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 p-2 border border-white rounded-full hover:bg-white hover:text-black transition"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={next}
            className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 p-2 border border-white rounded-full hover:bg-white hover:text-black transition"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Add Review Button */}
      <div className="py-4 flex justify-center">
        <button
          className="bg-button text-text-heading font-semibold py-2 px-6 rounded-md shadow-md hover:scale-105 transition"
          onClick={() => setReviewModal(true)}
        >
          {user.review.rating > 0 ? "Edit Review" : "Add Review"}
        </button>
      </div>

      {/* Add Review Modal */}
      {reviewModal && (
        <AddReview
          initialReview={user.review}
          setIsModalOpen={setReviewModal}
          onSubmit={submitReview}
        />
      )}
    </div>
  );
}
