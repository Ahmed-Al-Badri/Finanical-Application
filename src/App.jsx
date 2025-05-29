import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Login_ } from "./Logins/Login";
import { logout } from "./FirebaseLogins";
import { SignUp } from "./Logins/Login";
import Details, { Details_Logout } from "./Details/Details";

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
];

const navs_login = [
  { name: "Login", href: "/Login" },
  { name: "SignUp", href: "/SignUp" },
  { name: "Details", href: "/Details" },
];

function App() {
  let [logged_in, status_] = useState(null);
  let auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    status_(user);
  });

  return (
    <Router>
      <div className="Base">
        <div className="InnerBase">
          <div className="Navigation">
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
            <Routes>
              <Route path="/Home" element={<Home />} />
              <Route path="/Transactions" element={<Transactions />} />
              <Route path="/Login" element={<Login_ />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route
                path="/Details"
                element={logged_in ? <Details /> : <Details_Logout />}
              />
            </Routes>
          </div>

          <div className="Footer"></div>
        </div>
      </div>
    </Router>
  );
}

export default App;
