import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserThunk } from "../../store/slice/user/user.thunk";
import { getOtherUsersThunk } from "../../store/slice/user/user.thunk";
import { useEffect, useState } from "react";
import User from "./User";

function UserSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");

  const [users, setUsers] = useState([]);

  const { userProfile, otherUsers } = useSelector((state) => state.userReducer);

  useEffect(() => {
    if (!searchValue) {
      setUsers(otherUsers);
    } else {
      setUsers(
        otherUsers.filter((user) => {
          return (
            user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.fullName
              .toLowerCase()
              .includes(searchValue.toLocaleLowerCase())
          );
        })
      );
    }
  }, [searchValue, otherUsers]);



  useEffect(() => {
    (async () => {
      await dispatch(getOtherUsersThunk());
    })();
  }, []);

  const handleLogout = async () => {
    const response = await dispatch(logoutUserThunk());
    if (response?.payload?.success) {
      navigate("/login");
    }
  };

  return (
    <div className="max-w-[20rem] w-full h-screen flex flex-col border-r border-r-white/10">
      <h1 className="bg-base-300 mx-3 rounded-lg mt-3 px-2 py-1 text-[#605EFF] text-xl font-black">
        CHAT APP
      </h1>

      <div className="p-3">
        <label className="input input-bordered">
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            type="search"
            placeholder="Search"
          />
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
        </label>
      </div>

      <div className="h-full overflow-y-auto px-3 flex flex-col gap-2">
        {users?.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
      {/* bg-[hsl(210,15%,11%)] */}
      <div className="flex items-center justify-between p-3 bg-base-200">
        <div className="avatar">
          <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring-2 ring-offset-2">
            <img src={`${userProfile?.avatar}`} />
          </div>
        </div>
        <button className="btn btn-sm btn-primary px-4" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
export default UserSidebar;
