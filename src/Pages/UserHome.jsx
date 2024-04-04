import logo from "../assets/Images/logo.png";
import { IoSearch } from "react-icons/io5";
import { MdKeyboardArrowDown, MdFavorite, MdDelete } from "react-icons/md";
import { FaCheckDouble, FaPowerOff } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { database } from "../FirebaseConfig/FirebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";

const UserHome = () => {
  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.removeItem("email");
    toast.success("Logout successfully");
    navigate("/");
  };
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const email = localStorage.getItem("email");
  const [val, setVal] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  console.log("Email:", email);

  const value = collection(database, "todos");

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(
          query(collection(database, "todos"), where("email", "==", email))
        );
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setVal(data.reverse());
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [count, email]);

  const handleAdd = async () => {
    if (!title.trim()) {
      toast.error("Please provide Title");
      return;
    }
    if (!description.trim()) {
      toast.error("Please provide Description");
      return;
    }

    await addDoc(value, {
      title: title,
      description: description,
      completed: completed,
      favorite: favorite,
      email: email,
    });
    setTitle("");
    setDescription("");
    toast.success("Todo added");
    setCount((prevCount) => prevCount + 1);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      const updateDeleted = doc(database, "todos", id);
      await deleteDoc(updateDeleted);
      toast.success("Task Deleted");
      setCount((prevCount) => prevCount + 1);
    }
  };

  const handleCompleted = async (id) => {
    const updateCompleted = doc(database, "todos", id);
    await updateDoc(updateCompleted, { completed: true });
    toast.success("Task marked as completed");
    setCount((prevCount) => prevCount + 1);
  };

  const handleFavorite = async (id) => {
    const updateFavorite = doc(database, "todos", id);
    await updateDoc(updateFavorite, { favorite: true });
    toast.success("Task marked as Favorite");
    setCount((prevCount) => prevCount + 1);
  };

  const filteredTodos = val.filter((todo) => {
    if (filter === "completed" && !todo.completed) return false;
    if (filter === "favorite" && !todo.favorite) return false;
    if (filter === "All") return true;
    if (
      !todo.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !todo.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <>
      <div className="flex p-[59px] justify-center">
        <div className="flex flex-col justify-center md:flex-row">
          {/* Left side */}
          <div className="md:w-1/2 lg:border-r-2 border-gray-300">
            <div className="flex items-center  justify-between">
              <img src={logo} alt="Logo" className="h-20 w-20" />
              <button
                onClick={handleLogOut}
                className="mr-5 text-xl relative group"
              >
                <FaPowerOff className="text-black group-hover:text-red-500" />
                <span className="absolute  right-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 px-4 ">
                  Logout
                </span>
              </button>
            </div>
            <div className="flex items-center my-20 justify-center px-20">
              <div className="px-8 text-center">
                <h1 className="font-semibold text-3xl leading-10 mb-4">TODO</h1>
                <p className="text-gray-700 text-justify mb-8 font-normal text-base">
                  A to-do list is essential for effective time management,
                  prioritizing tasks, and maintaining focus. It helps organize
                  objectives and deadlines, leading to reduced stress and
                  increased productivity. Embracing this tool enhances
                  efficiency and work-life balance.
                </p>
                <form className="mb-8">
                  <div className="mb-4">
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="inputField1"
                      type="text"
                      placeholder="Title"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="shadow appearance-none border rounded w-full border-gray-400 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="inputField2"
                      type="text"
                      placeholder="Description"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      onClick={handleAdd}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-20 rounded focus:outline-none focus:shadow-outline"
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="md:w-1/2 p-12">
            <h2 className="text-xl font-bold mb-4 text-gray-800">TODO LIST</h2>
            <div className="flex lg:gap-20   justify-between items-center mb-4">
              <div className="flex relative flex-grow">
                <input
                  className="w-full shadow appearance-none border rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Search with title"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-3 text-gray-700 pointer-events-none">
                  <IoSearch className=" h-5 w-5" />
                </div>
              </div>
              <div className="flex relative flex-grow">
                <select
                  className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Filter By"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="" disabled hidden>
                    Filter By
                  </option>
                  <option value="completed">Completed</option>
                  <option value="favorite">Favorite</option>
                  <option value="all  ">All</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 pointer-events-none">
                  <MdKeyboardArrowDown className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="p-4 overflow-y-auto scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-gray-300 mt-24 max-h-[330px]">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <RotatingLines
                    visible={true}
                    height={40}
                    width={40}
                    color="grey"
                    strokeWidth={5}
                    animationDuration={0.75}
                    aria-label="Loading"
                    role="alert"
                    aria-busy="true"
                  />
                </div>
              ) : filteredTodos.length === 0 ? (
                <h1 className="text-xl">No Todos Added </h1>
              ) : (
                filteredTodos.map((values) => (
                  <div
                    className="flex items-center justify-between border-b border-gray-400 py-4"
                    key={values.id}
                  >
                    <div className="w-4/5">
                      <h2
                        className={`text-lg font-semibold text-gray-900 mb-2 ${
                          values.completed ? "opacity-75" : "opacity-100"
                        }`}
                      >
                        {values.title}
                      </h2>
                      <p
                        className={`text-gray-700 ${
                          values.completed ? "opacity-75" : "opacity-100"
                        }`}
                      >
                        {values.description}
                      </p>
                    </div>
                    <div className="w-1/5 flex flex-col items-end space-y-2">
                      <button
                        onClick={() => handleCompleted(values.id)}
                        className={`text-sm focus:outline-none ${
                          values.completed
                            ? "text-blue-500 hover:text-blue-700"
                            : "text-gray-700 hover:text-gray-900"
                        }`}
                      >
                        <FaCheckDouble />
                      </button>

                      <button
                        onClick={() => handleFavorite(values.id)}
                        className={`text-sm focus:outline-none ${
                          values.favorite
                            ? "text-pink-500 hover:text-pink-700"
                            : "text-gray-700 hover:text-gray-900"
                        }`}
                      >
                        <MdFavorite />
                      </button>

                      <button
                        onClick={() => handleDelete(values.id)}
                        className={
                          "text-sm focus:outline-none text-red-500 hover:text-red-700"
                        }
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserHome;
