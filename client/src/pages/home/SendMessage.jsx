import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageThunk } from "../../store/slice/message/message.thunk";
import {setScreenLoading} from '../../store/slice/message/message.slice'

const SendMessage = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const { selectedUser } = useSelector((state) => state.userReducer);
  const handleSendMessage = (e) => {
    dispatch(
      sendMessageThunk({
        receiverId: selectedUser?._id,
        message,
      })
    )
    setMessage('')
    dispatch(setScreenLoading(false))
  };
  return (
    <div className="w-full p-3 flex gap-2">
      <input
      value={message}
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        placeholder="Type Here"
        className="input input-primary w-full"
      />

      <button
        onClick={handleSendMessage}
        className="btn btn-square btn-primary btn-outline "
      >
        <IoSend />
      </button>
    </div>
  );
};

export default SendMessage;
