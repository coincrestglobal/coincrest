import { useEffect, useState } from "react";

const Toast = ({ message, type }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`absolute top-5 right-5 z-10 px-6 py-3 text-white rounded-lg shadow-lg text-lg 
                  transition-all duration-500 transform ${
                    visible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-10"
                  } ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      {message}
    </div>
  );
};

export default Toast;
