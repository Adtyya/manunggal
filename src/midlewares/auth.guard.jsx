import { useEffect } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";
import useInformationUser from "@/components/global/useInformationUser";

export default function Auth({ children }) {
  const [token] = useLocalStorage("token");
  const navigate = useNavigate();
  const hook = useInformationUser();

  useEffect(() => {
    if (token === null || token === undefined) {
      hook.setAll(null);
      hook.setRole(null);
      navigate("/sign-in");
    }
  }, [token]);

  return children;
}
