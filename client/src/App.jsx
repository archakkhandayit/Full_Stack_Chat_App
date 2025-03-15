import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";

import { getUserProfileThunk } from "./store/slice/user/user.thunk";
function App() {
  
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(getUserProfileThunk());
      
    })();
  }, []);


  return (
    <>
      <Toaster position="top-center" reverseOrder={false}/>
    </>
  );
}

export default App;
