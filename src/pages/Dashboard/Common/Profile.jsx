import useAuth from "../../../hooks/useAuth";
import { Helmet } from "react-helmet-async";
import useRole from "../../../hooks/useRole";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { imageUpload } from "../../../api/utils";
import UpdateProfileModal from "../../../components/Modal/UpdateProfileModal";
import { useState } from "react";
import toast from "react-hot-toast";
import ResetPasswordModal from "../../../components/Modal/ResetPasswordModal";

const Profile = () => {
  const { user, loading, setLoading, updateUserProfile, resetPassword } =
    useAuth();
  const [role, isLoading] = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [image, setImage] = useState(null);
  const [isOpenPassword, setIsOpenPassword] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleUpdateProfile = async () => {
    try {
      const image_url = await imageUpload(image);
      await updateUserProfile(name, image_url);
      toast.success("Profile updated successfully");
      return setIsOpen(false);
    } catch (error) {
      // console.log(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(user?.email);
      toast.success("Password reset email sent");
      return setIsOpenPassword(false);
    } catch (error) {
      // console.log(error);
      toast.error("Failed to send password reset email");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) return <LoadingSpinner />;

  return (
    <div className="flex justify-center items-center h-screen">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div className="bg-white shadow-lg rounded-2xl w-3/5">
        <img
          alt="profile"
          src="https://wallpapercave.com/wp/wp10784415.jpg"
          className="w-full mb-4 rounded-t-lg h-36"
        />
        <div className="flex flex-col items-center justify-center p-4 -mt-16">
          <a href="#" className="relative block">
            <img
              alt="profile"
              src={user?.photoURL}
              className="mx-auto object-cover rounded-full h-24 w-24  border-2 border-white "
            />
          </a>

          <p className="p-2 px-4 text-xs text-white bg-pink-500 rounded-full">
            {role.toUpperCase()}
          </p>
          <p className="mt-2 text-xl font-medium text-gray-800 ">
            User Id: {user?.uid}
          </p>
          <div className="w-full p-2 mt-4 rounded-lg">
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 ">
              <p className="flex flex-col">
                Name
                <span className="font-bold text-black ">
                  {user?.displayName}
                </span>
              </p>
              <p className="flex flex-col">
                Email
                <span className="font-bold text-black ">{user?.email}</span>
              </p>

              <div>
                <button
                  onClick={() => setIsOpen(true)}
                  className="bg-[#F43F5E] px-10 py-1 rounded-lg text-white cursor-pointer hover:bg-[#af4053] block mb-1"
                >
                  Update Profile
                </button>
                {/* modal for update profile */}
                <UpdateProfileModal
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  user={user}
                  handleUpdateProfile={handleUpdateProfile}
                  name={name}
                  setName={setName}
                  handleImage={handleImage}
                />
                <button
                  onClick={() => setIsOpenPassword(true)}
                  className="bg-[#F43F5E] px-7 py-1 rounded-lg text-white cursor-pointer hover:bg-[#af4053]"
                >
                  Change Password
                </button>
                {/* modal for reset password */}
                <ResetPasswordModal
                  isOpen={isOpenPassword}
                  setIsOpen={setIsOpenPassword}
                  user={user}
                  handleResetPassword={handleResetPassword}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
