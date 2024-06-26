import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from './Login';
import { AppContextProvider, useAppContext } from './appcontext';
import Header from './Header';
import Menu from './Menu';
import MainPage from "./MainPage";
import PortalPage from "./PortalPage";
import Logout from "./Logout";

function App() {
  return (
    <AppContextProvider>
      <Header color='primary' dark expand='md' container='fluid' fixed='top' full="true" />
      <div className='container mt-5 pt-5'>
        <Routes>
          <Route element={<Menu />} >
            <Route path='/' element={<MainPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/portal' 
                  element={
                    <RequireAuth>
                      <PortalPage />
                    </RequireAuth>
                  } />
            <Route path='*' element={<Navigate to='/' />} />
          </Route>
        </Routes>
      </div>
    </AppContextProvider>
  );

  function RequireAuth({ children }: { children: JSX.Element }) {
    let context = useAppContext();
    let location = useLocation();

    if (!context.session?.loggedIn) {
      return (<Navigate to="/login" state={{ from: location }} replace />);
    }

    return children;
  }
}
export default App;
