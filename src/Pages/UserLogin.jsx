import { toast } from "react-toastify";
import logo from "../assets/Images/logo.png";
import rightSideImage from "../assets/Images/rightSideImage.png";
import { auth, provider } from "../FirebaseConfig/FirebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const UserLogin = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    signInWithPopup(auth, provider)
      .then((data) => {
        localStorage.setItem("email", data.user.email);
        toast.success("Login successfully");
        navigate("/userHome");
      })
      .catch((error) => {
        console.error("Error signing in:", error.message);
        toast.error("Failed to sign in. Please try again later.");
      });
  };
  useEffect(() => {
    if (localStorage.getItem("email")) {
      navigate("/userHome");
    }
  }, []);

  return (
    <div className="flex flex-col justify-center md:flex-row w-full">
      {/* Left side */}
      <div className="md:w-1/2 p-[59px]">
        {/* Logo and Heading */}
        <div className="flex items-center justify-between">
          {/* Replace 'YourLogo.svg' with your actual logo */}
          <img src={logo} alt="Logo" className="h-20 w-20" />
        </div>
        {/* Description */}
        <div className="flex items-center my-20 justify-center lg:px-20">
          <div className="px-8 text-center">
            <h1 className="font-semibold text-3xl leading-10 mb-4">
              TODO LOGIN
            </h1>

            <p className="text-gray-700 text-justify mb-8 font-normal text-base">
              A to-do list is essential for effective time management,
              prioritizing tasks, and maintaining focus. It helps organize
              objectives and deadlines, leading to reduced stress and increased
              productivity. Embracing this tool enhances efficiency and
              work-life balance.
            </p>

            {/* Input Field and Button */}
            <div className="flex items-center justify-center">
              <button
                onClick={handleClick}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-20 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                SignIn Using Google
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="md:w-1/2 ">
        {/* Replace 'YourLogo.svg' with your actual logo */}
        <img src={rightSideImage} alt="Logo" className=" h-screen  w-full" />
      </div>
    </div>
  );
};

export default UserLogin;
