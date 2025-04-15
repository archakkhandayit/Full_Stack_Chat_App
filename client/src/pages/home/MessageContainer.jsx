import Message from "./Message";
import User from "./User";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getMessageThunk,
  pollMessagesThunk,
} from "../../store/slice/message/message.thunk";
import { setScreenLoading } from '../../store/slice/message/message.slice'
import SendMessage from "./SendMessage";

function MessageContainer() {
  const dispatch = useDispatch();

  const [lastTimestamp, setLastTimestamp] = useState(
    "1970-01-01T00:00:00.000Z"
  );

  const { selectedUser } = useSelector((state) => state.userReducer);
  const { messages, screenLoading } = useSelector(
    (state) => state.messageReducer
  );

  //First initial messages fetching
  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(setScreenLoading(true));
      dispatch(getMessageThunk({ receiverId: selectedUser?._id })).then(
        (response) => {
          dispatch(setScreenLoading(false));
          const latestMessage =
            response?.payload?.responseData?.conversation?.messages?.slice(
              -1
            )[0];
          if (latestMessage?.updatedAt) {
            setLastTimestamp(latestMessage.updatedAt);
          }
        }
      );
    }
  }, [selectedUser]);

  //Short Polling for new Messages
  useEffect(() => {
    if (!selectedUser?._id) return;

    const interval = setInterval(async () => {
      const response = await dispatch(
        pollMessagesThunk({
          receiverId: selectedUser?._id,
          timestamp: lastTimestamp,
        })
      );

      if (response?.payload?.responseData?.newMessages?.length > 0) {
        const newMessages = response.payload.responseData.newMessages;
        const latestTimestamp = newMessages[newMessages.length - 1].updatedAt;
        setLastTimestamp(latestTimestamp); // Update to the latest updatedAt
      }
    }, 10000); // Poll every 10 seconds

    return () => {
      clearInterval(interval); // Cleanup on unmount
    };
  }, [selectedUser, lastTimestamp, dispatch]);

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
            {screenLoading ? (
              <div className="flex justify-center items-center h-full">
              <div className="mx-auto text-2xl text-center">Loading Messages...</div>
              </div>
            ) : messages?.length === 0 || messages === null ? (
              <div className="flex justify-center items-center h-full">
              <div className="text-center text-2xl">Say "Hi 👋"!</div>
              </div>
            ) : (
              messages?.map((messageDetails) => (
                <Message
                  key={messageDetails?._id}
                  messageDetails={messageDetails}
                />
              ))
            )}
          </div>
          <SendMessage />
        </div>
      )}
    </>
  );
}
export default MessageContainer;
