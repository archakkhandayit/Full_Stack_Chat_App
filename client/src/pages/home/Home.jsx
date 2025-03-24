// import { useDispatch, useSelector } from "react-redux";
import MessageContainer from "./MessageContainer";
import UserSidebar from "./UserSidebar";
// import { useEffect } from "react";

// import { setNewMessage } from "../../store/slice/message/message.slice";

// import {
//   initializeSocket,
//   setOnlineUsers,
// } from "../../store/slice/socket/socket";

function Home() {
  // const dispatch = useDispatch();

  // const { isAuthenticated, userProfile } = useSelector(
  //   (state) => state.userReducer
  // );
  // const { socket } = useSelector((state) => state.socketReducer);

  // useEffect(() => {
  //   if (!isAuthenticated) return;
  //   dispatch(initializeSocket(userProfile?._id));
  // }, [isAuthenticated]);

  // useEffect(() => {
  //   if (!socket) return;
  //   socket.on("onlineUsers", (onlineUsers) => {
  //     dispatch(setOnlineUsers(onlineUsers));
  //   });

  //   if (!socket) return;
  //   socket.on("newMessage", (newMessage) => {
  //     dispatch(setNewMessage(newMessage));
  //   });

  //   return () => {
  //     socket.close();
  //   };
  // }, [socket]);
  return (
    <div className="flex">
      <UserSidebar />
      <MessageContainer />
    </div>
  );
}
export default Home;
