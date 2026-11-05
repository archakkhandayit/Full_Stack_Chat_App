import Message from "./Message";
import User from "./User";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getMessageThunk } from "../../store/slice/message/message.thunk";
import SendMessage from "./SendMessage";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

function MessageContainer() {
  const dispatch = useDispatch();

  const { selectedUser } = useSelector((state) => state.userReducer);
  const { messages } = useSelector((state) => state.messageReducer);

  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getMessageThunk({ receiverId: selectedUser?._id }));
    }
  }, [selectedUser, dispatch]);

  const hasMessages = messages && messages.length > 0;

  return (
    <>
      {!selectedUser ? (
        <div className="w-full h-screen flex items-center justify-center flex-col gap-3 text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl mb-1">
            <IoChatbubbleEllipsesOutline />
          </div>
          <h2 className="text-2xl font-bold text-base-content">
            Welcome to Chat App
          </h2>
          <p className="text-sm text-base-content/60">
            Select a friend from the sidebar to start a conversation!
          </p>
        </div>
      ) : (
        <div className="h-screen w-full flex flex-col">
          <div className="p-3 border-b border-b-white/10">
            <User user={selectedUser} />
          </div>

          <div className="h-full overflow-y-auto p-3">
            {hasMessages ? (
              messages.map((messageDetails) => (
                <Message
                  key={messageDetails?._id}
                  messageDetails={messageDetails}
                />
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 select-none">
                <h3 className="text-xl font-semibold mt-2 text-base-content">
                  Say hello to {selectedUser?.fullName}! 👋
                </h3>
                <p className="text-sm text-base-content/60 max-w-xs mt-1.5">
                  No messages here yet. Break the ice and send your first message to get the conversation started!
                </p>

                <div className="mt-4 px-3.5 py-1.5 rounded-full bg-base-200 border border-white/5 text-xs text-base-content/70 flex items-center gap-2 shadow-sm">
                  <span>💬</span>
                  <span>Type a message below to say hi</span>
                </div>
              </div>
            )}
          </div>

          <SendMessage />
        </div>
      )}
    </>
  );
}

export default MessageContainer;
