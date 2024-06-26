import { Link } from "react-router-dom";
import { useAppContext } from "./appcontext";

export default function MainPage() {

    const appcontext = useAppContext();

    if (appcontext.session.loggedIn) {
        return (
            <div>
                <p>Welcome to MyEvents, a simple event management system.</p>
                <p>Click <Link to="/portal">here</Link> to go to the portal.</p>
                <p>Click <Link to="/logout">here</Link> to logout.</p>
            </div>
        );
    }
    else {
        return (
            <div>
                <p>Welcome to MyEvents, a simple event management system.</p>
                <p>Click <Link to="/login">here</Link> to login.</p>
            </div>
        );
    }
}