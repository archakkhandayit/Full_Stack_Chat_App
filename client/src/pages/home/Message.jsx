import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function Message({ messageDetails }) {
  const messageRef = useRef(null);
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const { userProfile, selectedUser } = useSelector(
    (state) => state.userReducer
  );

  const handleTime = (timeString) => {
    // Create a Date object from the ISO string
    const date = new Date(timeString);

    // Format the date as hour:min day/month/year in IST (Indian Standard Time)
    const options = {
      timeZone: "Asia/Kolkata", // Set the time zone to IST
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit", // Use 2-digit year
      hour12: true, // Use 12-hour format to show AM/PM
    };

    const formattedTime = new Intl.DateTimeFormat("en-GB", options).format(
      date
    );

    // The formatted time will return something like: "13/03/25, 11:18 am"
    // Split the formatted time by `,` to separate time from date
    const [datePart, timePart] = formattedTime.split(", ");

    // Further split to get day, month, year
    const [day, month, year] = datePart.split("/");

    // Further split to get hour, minute, period (am/pm)
    const [hour, minute] = timePart.split(":");
    let period = minute.split(" ")[1]; // AM or PM
    period = period?.toUpperCase();
    // Return the formatted string with time first, then date, and AM/PM with year
    return `${hour}:${minute.split(" ")[0]} ${period}  ${day}/${month}/${year}`;
  };

  return (
    <>
      <div
        ref={messageRef}
        className={`chat ${
          userProfile?._id === messageDetails?.senderId
            ? "chat-end"
            : "chat-start"
        }`}
      >
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS chat bubble component"
              src={`${
                userProfile?._id === messageDetails?.senderId
                  ? userProfile?.avatar
                  : selectedUser?.avatar
              }`}
            />
          </div>
        </div>
        <div className="chat-header">
          {/* Obi-Wan Kenobi */}
          <time className="text-xs opacity-50">
            {`${handleTime(messageDetails.createdAt)}`}
          </time>
        </div>
        <div className="chat-bubble">{messageDetails?.message}</div>
        {/* <div className="chat-footer opacity-50">Delivered</div> */}
      </div>
    </>
  );
}
export default Message;
