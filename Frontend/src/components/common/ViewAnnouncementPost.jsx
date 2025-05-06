import { X } from "lucide-react";

function ViewAnnouncementPost({ isOpen, onClose, announcement }) {
  if (!isOpen || !announcement) return null;

  return (
    <div className="fixed inset-0 bg-primary/90 bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-primary-light p-6 rounded-2xl shadow-2xl max-w-md w-full relative border border-secondary">
        <button
          className="absolute top-3 right-3 text-secondary hover:text-secondary-light transition"
          onClick={onClose}
        >
          <X />
        </button>
        <h2 className="text-xl font-bold text-text-heading mb-3">
          {announcement.title}
        </h2>
        <p className="text-text-body">{announcement.message}</p>
        <div className="mt-4 text-sm text-text-muted">
          Posted by:{" "}
          <span className="font-semibold text-text-body">
            {announcement.postedBy}
          </span>
        </div>
        <div className="mt-1 text-sm text-text-muted">
          Date: {announcement.date}
        </div>
      </div>
    </div>
  );
}

export default ViewAnnouncementPost;
