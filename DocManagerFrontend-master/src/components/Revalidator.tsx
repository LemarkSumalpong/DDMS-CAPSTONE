import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { JWTRefreshAPI, setAccessToken, setRefreshToken } from "./API";
import { auth_toggle } from "./plugins/redux/slices/AuthSlice";
import { RootState } from "./plugins/redux/Store";
import { toast } from "react-toastify";

export default function Revalidator() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = useSelector((state: RootState) => state.auth.value);
  const [rechecked, setRechecked] = useState(false);

  useEffect(() => {
    if (!authenticated && rechecked) {
      navigate("/");
      toast("Please log in to continue", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [authenticated, location.pathname, navigate, rechecked]);

  useEffect(() => {
    if (!authenticated) {
      JWTRefreshAPI().then(async (response) => {
        if (response) {
          await dispatch(auth_toggle());
          toast("User session restored", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          navigate("/dashboard/");
        } else {
          await setRefreshToken("");
          await setAccessToken("");
        }
        setRechecked(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
