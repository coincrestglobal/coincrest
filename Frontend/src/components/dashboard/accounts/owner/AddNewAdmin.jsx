import { useState } from "react";
import { useForm } from "react-hook-form";
import useSafeNavigate from "../../../../utils/useSafeNavigate";
import { addNewAdmin } from "../../../../services/operations/adminAndOwnerDashboardApi";
import { useUser } from "../../../common/UserContext";
import Loading from "../../../../pages/Loading";

function AddNewAdmin() {
  const { user } = useUser();
  const navigate = useSafeNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const newData = {
        name: data.name,
        email: data.email,
        ownerPassword: data.password,
      };

      const response = await addNewAdmin(user.token, newData);
      if (response.status === "success") {
        navigate(-1);
      }
      reset();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-primary-dark h-full flex items-center p-2">
      <div className="bg-primary shadow-lg rounded-2xl p-6 w-full max-w-md mx-auto ">
        <h2 className="text-2xl font-bold text-text-heading mb-6">
          Add New Admin
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <div>
            <label className="block text-text-heading mb-1">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-button"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-text-heading mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-button"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-text-heading mb-1">
              Enter your Password to Confirm Operation
            </label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-button"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Discard
            </button>
            <button
              type="submit"
              className="w-fit px-3 bg-button hover:bg-button-hover text-white py-2 rounded-md transition"
            >
              Add Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNewAdmin;
