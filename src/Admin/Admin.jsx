import { Component } from "react";
import "./Admin.css";
import { UserData } from "../FileSystem/FileSystem";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export default class Admin extends Component {
  constructor(prob) {
    super(prob);
    this.state = { loaded: false, users: [] };
  }

  componentDidMount() {
    this.load_users();
  }

  async load_users() {
    let data = await collection(getFirestore(), "users");
    data = await getDocs(data);
    data = data.docs.map((res) => {
      return res.data();
    });
    this.setState({ loaded: true, users: data }, () => {
      console.log("Loading/Loaded");
    });

    //let datas = {};
    //datas = JSON.stringify();
  }

  render() {
    return (
      <>
        {this.state.loaded == true ? (
          <>
            Loaded
            <div>
              {this.state.users.map((res, dec) => {
                return <User data={res} key={res.userID} />;

                return <div>{JSON.stringify(res)}</div>;
              })}
            </div>
          </>
        ) : (
          <>Loading</>
        )}
      </>
    );
  }
}

class User extends Component {
  constructor(prob) {
    super(prob);
    this.data = prob.data;
    this.state = { lock: this.data.Lock };
  }

  render() {
    return (
      <>
        <div className="User_">
          <div className="Details">
            <div className="First_name">
              Username: {this.data.name || "Unset"}
            </div>
            <div className="Email">Email: {this.data.email}</div>
          </div>
          <div className="Goal">
            <div className="Goaltitle">
              Goals:{" "}
              {
                this.data.Goals.Goals.map((res) => {
                  if (res != null) {
                    return 1;
                  }
                }).length
              }
            </div>
          </div>
          <div className="Effects">
            <div
              onClick={async () => {
                if (UserData.Userref) {
                  try {
                    await updateDoc(UserData.Userref, {
                      viewID: this.data.userID,
                    });
                    console.log(`viewID updated to ${this.data.userID}`);
                    UserData.UserSnap = await getDoc(UserData.Userref);
                    UserData.SnapData = UserData.UserSnap.data();
                  } catch (error) {
                    console.error("Error updating viewID:", error);
                  }
                } else {
                  console.error("User reference is not set");
                }
              }}
            >
              View-As
            </div>

            <div
              onClick={
                this.state.lock
                  ? async () => {
                      //set to false
                      let db = getFirestore();
                      let reference = await doc(db, "users", this.data.userID);
                      let data = undefined;
                      data = await setDoc(
                        reference,
                        { Lock: false },
                        { merge: true }
                      ).then(async () => {
                        //data set to false
                        console.log("false is set");
                        data = await getDoc(reference);
                        this.data = await data.data();
                        console.log(this.data.Lock);
                        this.setState({ lock: this.data.Lock });
                      });
                      console.log("Data is being changed in-process--");
                    }
                  : async () => {
                      let db = getFirestore();
                      let reference = await doc(db, "users", this.data.userID);
                      let data = undefined;
                      data = await setDoc(
                        reference,
                        { Lock: true },
                        { merge: true }
                      ).then(async () => {
                        //data set to false
                        console.log("false is set");

                        data = await getDoc(reference);
                        this.data = await data.data();
                        console.log(this.data.Lock);
                        this.setState({ lock: this.data.Lock });
                      });
                      console.log("empty");
                    }
              }
              className={`${this.state.lock == true ? "Locked" : "Unlocked"}`}
            >
              {" "}
              {this.state.lock == true ? (
                <>Unlock Account</>
              ) : (
                <>Lock Account</>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}
