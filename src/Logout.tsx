import { SessionType, useAppContext } from "./appcontext";
import { Navigate } from "react-router-dom";

export default function Logout() {
    const { contextLogout } = useAppContext();
    const sessionType: SessionType = {
        loggedIn: true,
        boxUser: undefined,
        jwtToken: undefined,
        boxClient: undefined
      }
    contextLogout();
    return (<Navigate to="/" replace />);
}