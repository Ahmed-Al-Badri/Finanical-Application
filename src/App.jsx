import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  href,
} from "react-router-dom";
import "./App.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Login_ } from "./Logins/Login";
import { logout } from "./FirebaseLogins";
import { SignUp } from "./Logins/Login";
import Details, { Details_Logout } from "./Details/Details";
import SetUpUser, { UserData } from "./FileSystem/FileSystem";
import { getDoc, onSnapshot } from "firebase/firestore";
import Admin from "./Admin/Admin";
import Goals_Page from "./Goals/Goals_";

const Home = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    console.log("User ID:", user.uid);
    console.log("Email:", user.email);
    console.log("Display Name:", user.displayName);
  } else {
    console.log("No user is logged in.");
  }

  return <div>Home Page</div>;
};
const Transactions = () => (
  <div>
    <h2>Transactions Page</h2>
  </div>
);

const navs = [
  {
    name: "Home",
    href: "/Home",
  },
  {
    name: "Transactions",
    href: "/Transactions",
  },
  {
    name: "Goals",
    href: "/Goals",
  },
];

const navs_login = [
  { name: "Login", href: "/Login" },
  { name: "SignUp", href: "/SignUp" },
  { name: "Details", href: "/Details" },
];

const navs_Admin = [{ name: "Admin", href: "/Admin" }];
let log_out = () => {};
function App() {
  let [logged_in, status_] = useState(null);
  let [admin, is_admin_] = useState(null);
  let [Lock, is_lock] = useState(null);
  let auth = getAuth();

  useEffect(() => {
    let listener = () => {};

    let returns = onAuthStateChanged(auth, async (user) => {
      if (user) {
        listener = await SetUpUser();
        status_(UserData.Userref);

        log_out = onSnapshot(UserData.Userref, (docscan) => {
          UserData.SnapData = docscan.data();
          is_lock(UserData.SnapData.Lock);
        });
        is_lock(await UserData.SnapData.Lock);
      } else {
        status_(null);
      }
      //SetUpUser();
    });

    return () => {
      //log_out();
      returns();
    };
  }, []);

  useEffect(() => {
    let datas = async () => {
      if (logged_in) {
        let data = (await getDoc(UserData.Userref)).data().isAdmin;
        console.log(data);
        is_admin_(data);
      }
    };
    datas();
  }, [logged_in]);

  return (
    <div>
      <Router>
        <div className="Base">
          <div className="InnerBase">
            <div className="Navigation">
              {admin == true ? (
                <>
                  <div className="Admin">
                    {navs_Admin.map((res, index) => {
                      return (
                        <Link key={index} to={res.href} className="NavMove">
                          {res.name}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="Slash"></div>
                </>
              ) : (
                <></>
              )}

              <div className="Navs">
                {navs.map((res, index) => (
                  <Link key={index} to={res.href} className="NavMove">
                    {res.name}
                  </Link>
                ))}
              </div>
              <div className="Slash" />
              <div className="Logins">
                {logged_in ? (
                  <>
                    <div
                      className="NavMove"
                      onClick={() => {
                        log_out();
                        logout();
                      }}
                    >
                      LogOut
                    </div>
                    <Link to={"Details"} className="NavMove">
                      Details
                    </Link>
                  </>
                ) : (
                  navs_login.map((res, index) => (
                    <Link key={index} to={res.href} className="NavMove">
                      {res.name}
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="Body">
              <div className="BodyInside">
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="/Home" element={<Home />} />

                  <Route path="/Admin" element={<Admin />} />
                  <Route
                    path="/Goals"
                    element={logged_in && !Lock ? <Goals_Page /> : <></>}
                  />

                  <Route path="/Transactions" element={<Transactions />} />
                  <Route path="/Login" element={<Login_ />} />
                  <Route path="/SignUp" element={<SignUp />} />

                  <Route
                    path="/Details"
                    element={
                      logged_in && UserData.SnapData.Lock == false ? (
                        <Details />
                      ) : (
                        <Details_Logout />
                      )
                    }
                  />
                </Routes>
              </div>
            </div>

            <div className="Footer"></div>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
