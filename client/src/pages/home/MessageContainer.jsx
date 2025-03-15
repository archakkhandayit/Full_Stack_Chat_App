import Message from "./Message";
import User from "./User";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getMessageThunk } from "../../store/slice/message/message.thunk";
import SendMessage from "./SendMessage";

function MessageContainer() {
  const dispatch = useDispatch();

  const { selectedUser } = useSelector(state => state.userReducer);
  const {messages} = useSelector(state => state.messageReducer);
  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getMessageThunk({ receiverId: selectedUser?._id }));
    }
  }, [selectedUser]);

  return (
    <>
      {!selectedUser ? (
        <div className="w-full flex items-center justify-center flex-col  gap-5">
          <h2 className="text-3xl">Welcome</h2>
          <p className="text-xl">please select a user</p> 
        </div>
      ) : (
        <div className="h-screen w-full flex flex-col">
          <div className="p-3 border-b border-b-white/10">
            <User user={selectedUser} />
          </div>
          <div className="h-full overflow-y-auto p-3">
            {messages?.map(messageDetails => <Message key={messageDetails?._id} messageDetails={messageDetails} />)}
          </div>
          <SendMessage/>
        </div>
      )}
    </>
  );
}
export default MessageContainer;
