import { Component } from "react";
import { useState } from "react";
import {
  loginWithEmail,
  loginWithGoogle,
  signUpWithEmail,
} from "../FirebaseLogins";
import "./Logins.css";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

function router_set(Component) {
  return (probs) => {
    const nav = useNavigate();
    return <Component {...probs} navigate={nav} />;
  };
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password);
      alert("Logged in successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      alert("Logged in with Google!");
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Login with Email</button>
      <br />
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
}

export default Login;

const Medway = (type) => {
  return (
    <div className="bases">
      <div className="line">
        <div className="line_in" />
      </div>
      {type.give}
      <div className="line">
        <div className="line_in" />
      </div>
    </div>
  );
};

class Login_Base extends Component {
  constructor(prob) {
    super(prob);
    this.props = prob;
    this.state = { email: "", password: "" };
  }

  componentDidMount() {
    let auth = getAuth();
    if (auth.currentUser) {
      console.log("Already logged in");
      this.props.navigate("/Home");
    }
  }

  handleEmailChange = (e) => {
    //console.log(e);
    this.setState({ email: e.target.value }, () => {});
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  login_with_email(prob) {
    if (prob.key == "Enter") {
      console.log("AA");
      console.log(this.state.email);
      loginWithEmail(this.state.email, this.state.password).then(() => {
        this.props.navigate("/Home");
      });
    }
  }

  render() {
    return (
      <>
        <div className="BaseLogin">
          <div className="SetUp">
            <div
              className="Closemark"
              onClick={() => {
                this.props.navigate("/Home");
              }}
            >
              X
            </div>
            <div className="IconTop"></div>
            <div className="Center">
              <Medway
                give={
                  <div
                    className="Button_"
                    onClick={() => {
                      loginWithGoogle().then(() => {
                        this.props.navigate("/Home");
                      });
                    }}
                  >
                    Sign in with Google
                  </div>
                }
              />
              <Medway give={"Or"} />

              <div className="Form_Input">
                <div>Email</div>
                <input
                  type="email"
                  className="Inputs"
                  onKeyDown={(prob) => {
                    this.login_with_email(prob);
                  }}
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                />
              </div>

              <div className="Form_Input">
                <div>Password</div>
                <input
                  onKeyDown={this.login_with_email}
                  type="password"
                  className="Inputs"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                />
              </div>

              <div className="Login_Pass">
                <div
                  className="Button_"
                  onClick={() => {
                    loginWithEmail(this.state.email, this.state.password).then(
                      () => {
                        this.props.navigate("/Home");
                      }
                    );
                  }}
                >
                  Login
                </div>
                <div className="Button_">Forgot Password</div>
              </div>

              <Medway
                give={
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      this.props.navigate("/SignUp");
                    }}
                  >
                    Sign-Up
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

let Login_ = router_set(Login_Base);
export { Login_ };

//sign-up

class SignUp_Base extends Component {
  constructor(prob) {
    super(prob);
    this.props = prob;
    this.state = { email: "", password: "" };
  }

  componentDidMount() {
    let auth = getAuth();
    if (auth.currentUser) {
      console.log("Already logged in");
      this.props.navigate("/Home");
    }
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.signUp();
    }
  };

  signUp = () => {
    const { email, password } = this.state;
    signUpWithEmail(email, password)
      .then(() => {
        this.props.navigate("/Home");
      })
      .catch((err) => {
        console.error("Sign-up error:", err);
      });
  };

  render() {
    return (
      <>
        <div className="BaseLogin">
          <div className="SetUp">
            <div
              className="Closemark"
              onClick={() => {
                this.props.navigate("/Home");
              }}
            >
              X
            </div>
            <div className="IconTop"></div>
            <div className="Center">
              <Medway
                give={
                  <div
                    className="Button_"
                    onClick={() => {
                      loginWithGoogle().then(() => {
                        this.props.navigate("/Home");
                      });
                    }}
                  >
                    Sign in with Google
                  </div>
                }
              />
              <Medway give={"Or"} />

              <div className="Form_Input">
                <div>Email</div>
                <input
                  type="email"
                  className="Inputs"
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                  onKeyDown={this.handleKeyDown}
                />
              </div>

              <div className="Form_Input">
                <div>Password</div>
                <input
                  type="password"
                  className="Inputs"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                  onKeyDown={this.handleKeyDown}
                />
              </div>

              <div className="Login_Pass">
                <div className="Button_" onClick={this.signUp}>
                  Sign Up
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

let SignUp = router_set(SignUp_Base);
export { SignUp };
