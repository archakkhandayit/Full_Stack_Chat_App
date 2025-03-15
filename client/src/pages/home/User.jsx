import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../store/slice/user/user.slice";

function User({ user }) {
  const dispatch = useDispatch();

  const { selectedUser } = useSelector((state) => state.userReducer);
  const { onlineUsers } = useSelector((state) => state.socketReducer);
  const isUserOnline = onlineUsers?.includes(user?._id);
  const handleUserClick = () => {
    dispatch(setSelectedUser(user));
  };

  return (
    <div
      onClick={handleUserClick}
      className={`flex gap-5 items-center rounded-lg hover:bg-gray-700 py-1 px-2 cursor-pointer 
        ${user?._id === selectedUser?._id && "bg-gray-700"}
        `}
    >
      <div className={`avatar ${isUserOnline && 'avatar-online'}`}>
        <div className="w-12 rounded-full">
          <img src={user?.avatar} />
        </div>
      </div>
      <div>
        <h2 className="line-clamp-1">{user?.fullName}</h2>
        <p className="text-xs text-[rgb(126,141,154)]">{user?.username}</p>
      </div>
    </div>
  );
}
export default User;
