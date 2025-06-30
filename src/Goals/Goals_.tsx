import "./Goals_Page.css";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { Component } from "react";

interface Goals {
  Goals: Goal[];
  current: number;
}

interface Goal {
  Title: string;
  is_del: boolean;
  Description: string;
  Created: string;
  Priority: "Low" | "Medium" | "High";
  is_done: boolean;
  Finsh: string;
  Update: string;
  ID: number;
}

interface state_ {
  viewing: string;
  doc_id: string;
  view_self: boolean;
  Goals: Goals;
  effectkey: number;
  expandindex: number | null;
}

interface base_snap {
  userID: string;
  isAdmin: boolean;
  viewID: string;
}

interface DataBox {
  icon: string;
  titel: string;
  values: string;
}

class Goals_Page extends Component {
  state: state_ = {
    viewing: "",
    doc_id: "",
    view_self: false,
    Goals: {
      current: 0,
      Goals: [],
    },
    expandindex: null,
    effectkey: -1,
  };
  constructor(prob) {
    super(prob);
    // this.state = {
    //   usersnap: null,
    //   viewing: null,
    //   doc_id: null,
    //   view_self: null,
    //   data: null,
    //   loaded: [],
    // };
  }

  fetchGoals = async () => {
    let db = await getFirestore();
    let viewing_data = await collection(
      db,
      `users/${this.state.viewing}/Goals`
    );
    let object_snap = await getDocs(viewing_data);
    let doc_id: string = "";
    try {
      let object_data = object_snap.docs.map((doc_: DocumentData) => {
        if (doc_id === "") {
          doc_id = doc_.id;
        }
        // doc_id = doc_.id;
        return { data: doc_.data() };
      });

      this.setState(
        {
          doc_id: doc_id,
          Goals: object_data[0].data.Goals as Goals,
        },
        () => {
          console.log(this.state.Goals);
          console.log("Data is set" + doc_id);
          // console.log(this.state.loaded);
          // console.log("Loading data");
          //this.addingGoals();
        }
      );
    } catch (err) {
      await addDoc(viewing_data, { Goals: { current: 0, Goals: [] } }).then(
        async () => {
          console.log("Ready");
          await this.fetchGoals();
        }
      );
      console.log("Is empty");
    }
  };

  addingGoals = async (goal: Goal, key: any) => {
    console.log("Adding the data");
    console.log(goal);
    console.log(key);
    let db = getFirestore();
    //let goalsRef = collection(db, `users/${this.state.viewing}/Goals`);
    //let datasnap = await getDocs(goalsRef);

    let Goals = this.state.Goals;
    let ID_OF_DOC = this.state.doc_id;
    // try {
    //   datasnap.forEach((res) => {
    //     ID_OF_DOC = res.id;
    //     Goals = res.data().Goals;
    //   });
    // } catch (res) {
    //   Goals = undefined;
    // }
    let is_update = false;

    if (key >= 0) {
      if (key >= Goals.Goals.length) {
        key = Goals.current;
        Goals.Goals[key] = goal;
      } else {
        Goals.Goals[key] = goal;
        is_update = true;
      }
    } else {
      Goals.Goals[Goals.current] = goal;
      key = Goals.current;
      //Goals.current++;
    }
    let curtime = gettime();
    goal.ID = key;
    if (is_update == false) {
      goal.Update = curtime;
      goal.Created = curtime;
    } else {
      goal.Update = curtime;
    }

    //try {
    // [`Goals.Goals.${key}`]: Goals.Goals[key],

    console.log(ID_OF_DOC);
    let updatedocref = doc(db, `users/${this.state.viewing}/Goals`, ID_OF_DOC);
    await updateDoc(updatedocref, {
      "Goals.current": is_update == true ? Goals.current : Goals.current + 1,
      [`Goals.Goals`]: Goals.Goals,
    })
      .then(() => {
        if (is_update == false) {
          Goals.current++;
          this.setState({ Goals: Goals });
        }
      })
      .catch((er) => {
        console.log(er);
      });
    // } catch (error) {
    //   console.log("error");
    //   console.log(error);
    // }
  };

  componentDidMount() {
    let data = async () => {
      let user = await getAuth().currentUser;
      if (!user) {
        return;
      }
      let db = await getFirestore();
      let userref = await doc(db, "users", user.uid);
      let usersnap = await getDoc(userref);
      if (usersnap.data() != undefined) {
        let currentData: base_snap = usersnap.data() as base_snap;
        let getby = user.uid;
        let same_user = true;
        if (currentData.isAdmin) {
          if (user.uid != currentData.viewID) {
            getby = currentData.viewID;
            same_user = false;
          }
        }

        this.setState({ viewing: getby, view_self: same_user }, () => {
          console.log("loading fetchgoals");
          this.fetchGoals();
        });
      } else {
        data();
      }
    };
    data();
  }

  toggledes = (index: number) => {
    this.setState((prev: state_) => ({
      expandindex: prev.expandindex === index ? null : index,
    }));
  };

  info: Goal[] = [
    {
      Title: "The title of the Goal", //; //"Title of Goal",
      is_del: false, //; //false,
      Description:
        "This is the full, This is the full, This is the full, This is the full", //; //"The meaning of the Goal",
      Created: "2021",
      Priority: "Low", //Medium, High
      is_done: false, //;
      Finsh: "2022", //; //
      Update: "2021.5", //;
      ID: 0,
    },
  ];

  render() {
    return (
      <div className="GoalsPage">
        {this.state.viewing == null ? (
          <>Loading</>
        ) : (
          <>
            <h1 className="Title_">The Goals of the User</h1>
            <div className="Dataset">
              {analyzeGoals(this.state.Goals.Goals).map(
                (res: DataBox, key_: number) => {
                  return (
                    <div className="DataBox" key={key_}>
                      <div className="Title">{res.titel}</div>
                      <div className="Value">
                        <i className={`fas ${res.icon}`}></i> {res.values}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
            <div className="BodyCenter">
              <div className="Bodyset">
                {this.state.Goals.Goals.map((goal, index) => (
                  <div
                    key={index}
                    className="GoalView"
                    onClick={() => this.toggledes(index)}
                  >
                    <div className="GoalTime">
                      {goal.is_done == false ? (
                        <>
                          <TimeLeft endDate={goal.Finsh} />
                        </>
                      ) : (
                        <>Accomplished</>
                      )}
                    </div>
                    <div className="GoalBody">
                      <div className="GoalDate">
                        Created: {formattime(goal.Created)}
                      </div>
                      <div className="GoalInformation">
                        <div className="GoalTitle">{goal.Title}</div>
                        {this.state.expandindex !== index && (
                          <div className="GoalSmallDescription">
                            {goal.Description.substring(0, 50)}...
                          </div>
                        )}
                      </div>
                      <div className="GoalDate">
                        Finsh: {formattime(goal.Finsh)}
                      </div>
                    </div>
                    {/* description */}
                    {this.state.expandindex === index && (
                      <div className="GoalDescription">{goal.Description}</div>
                    )}
                    <div className="GoalOptions">
                      <div
                        onClick={() => {
                          let temp: Goal = this.state.Goals.Goals[goal.ID];
                          temp.is_del = true;
                          this.addingGoals(temp, temp.ID);
                        }}
                      >
                        Remove
                      </div>
                      <div
                        onClick={() => {
                          let temp: Goal = this.state.Goals.Goals[goal.ID];
                          temp.is_done = true;
                          this.addingGoals(temp, temp.ID);
                        }}
                      >
                        Complete
                      </div>
                      <div
                        onClick={() => {
                          this.setState({ effectkey: goal.ID });
                        }}
                      >
                        Edit
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="BodyRight">Rigth Data</div>
            </div>
            <div className="Direction">
              {this.state.effectkey == -1 ? (
                <div
                  onClick={() => {
                    this.setState({ effectkey: -2 });
                  }}
                >
                  New Goal
                </div>
              ) : (
                <div className="AddBlock">
                  <AddGoal
                    key_={this.state.effectkey}
                    Goal={
                      this.state.effectkey != -2
                        ? this.state.Goals.Goals[this.state.effectkey]
                        : {}
                    }
                    finsh={(prob: number) => {
                      this.setState({ effectkey: prob });
                    }}
                    addGoal={async (res, rea) => {
                      await this.addingGoals(res, rea);
                    }}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default Goals_Page;

function analyzeGoals(goals: Goal[]): DataBox[] {
  const totalGoals = goals.length;
  const finishedGoals = goals.filter((g) => g.is_done).length;
  const activeGoals = goals.filter((g) => !g.is_done && !g.is_del).length;

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const goalsToCompleteWeek = goals.filter((g) => {
    const finishDate = new Date(g.Finsh);
    return finishDate >= startOfWeek && finishDate <= now && !g.is_done;
  }).length;

  const goalsToCompleteMonth = goals.filter((g) => {
    const finishDate = new Date(g.Finsh);
    return finishDate >= startOfMonth && finishDate <= now && !g.is_done;
  }).length;

  return [
    {
      icon: "fa-check-circle",
      titel: "Finished Goals",
      values: finishedGoals.toString(),
    },
    {
      icon: "fa-list-alt",
      titel: "Total Goals",
      values: totalGoals.toString(),
    },
    {
      icon: "fa-user-clock",
      titel: "Active Goals",
      values: activeGoals.toString(),
    },
    {
      icon: "fa-calendar-week",
      titel: "Upcoming Goals/Week",
      values: goalsToCompleteWeek.toString(),
    },
    {
      icon: "fa-calendar-alt",
      titel: "Upcoming Goals/Month",
      values: goalsToCompleteMonth.toString(),
    },
  ];
}

let Options: string[] = ["Low", "Medium", "High"];

class AddGoal extends Component {
  state: Goal = {
    Created: "",
    Description: "",
    Finsh: "",
    ID: -1,
    is_del: false,
    is_done: false,
    Priority: "Low",
    Title: "",
    Update: "",
  };

  finsh: any;
  addGoal: any;
  key_: number | undefined;

  constructor(prob) {
    super(prob);
    this.addGoal = prob.addGoal;
    this.finsh = prob.finsh;
    this.state = { ...this.state, ...(prob.Goal || {}) };
    this.key_ = prob.key_;
  }

  handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as Record<keyof Goal, string>);
  };

  render() {
    return (
      <div className="Form">
        <div className="GetData">
          <input
            type="text"
            id="Title"
            name="Title"
            value={this.state.Title}
            onChange={this.handleInputChange}
            required
          />
          <span>Title</span>
        </div>
        <div className="GetData">
          <textarea
            id="Description"
            name="Description"
            value={this.state.Description}
            onChange={this.handleInputChange}
            required
          />
          <span>Description</span>
        </div>
        <div className="Options Top">
          {Options.map((res: string, val: number) => {
            return (
              <div
                className={`${res == this.state.Priority ? "Active" : ""}`}
                key={val}
                onClick={() => {
                  this.setState({ Priority: res }, () => {
                    console.log(this.state);
                  });
                }}
              >
                {res}
              </div>
            );
          })}
        </div>
        <div>
          <div>Finsh By</div>
          <input
            type="datetime-local"
            id="Finsh"
            name="Finsh"
            value={this.state.Finsh}
            onChange={this.handleInputChange}
          />
        </div>

        <div className="Options">
          <div
            onClick={() => {
              this.finsh(-1);
            }}
          >
            Close
          </div>
          <div
            onClick={() => {
              this.addGoal(this.state, this.key_).then(() => {
                this.finsh(-1);
              });
            }}
          >
            {this.key_ == -2 ? <>Add Goal</> : <>Update</>}
          </div>
        </div>
      </div>
    );
  }
}

function gettime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;

  return dateTimeString;
}

function formattime(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const seconds = Math.floor((now - date) / 1000);
  const absSeconds = Math.abs(seconds);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const count = Math.floor(absSeconds / secondsInUnit);
    if (count >= 1) {
      if (unit === "day" && count === 1) {
        if (seconds > 0) return "yesterday";
        if (seconds < 0) return "tomorrow";
      }
      if (unit === "hour" && count === 1) return "an hour ago";
      if (unit === "minute" && count === 1) return "a minute ago";
      if (unit === "second" && count < 60) return "just now";

      if (seconds > 0) {
        if (unit === "day") return `${count} days ago`;
        if (unit === "week") return `${count} weeks ago`;
        if (unit === "month") return `${count} months ago`;
        if (unit === "year") return `${count} years ago`;
        if (unit === "hour") return `${count} hours ago`;
        if (unit === "minute") return `${count} minutes ago`;
        if (unit === "second") return `${count} seconds ago`;
      } else {
        if (unit === "day") return `in ${count} days`;
        if (unit === "week") return `in ${count} weeks`;
        if (unit === "month") return `in ${count} months`;
        if (unit === "year") return `in ${count} years`;
        if (unit === "hour") return `in ${count} hours`;
        if (unit === "minute") return `in ${count} minutes`;
        if (unit === "second") return `in ${count} seconds`;
      }
    }
  }
  return "just now";
}
//From online;
interface TimeLeftProps {
  endDate: string;
}

interface TimeLeftState {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

class TimeLeft extends Component<TimeLeftProps, TimeLeftState> {
  timerID: NodeJS.Timeout | undefined;

  constructor(props: TimeLeftProps) {
    super(props);
    this.state = this.calculateTimeLeft();
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.setState(this.calculateTimeLeft());
    }, 1000);
  }

  componentWillUnmount() {
    if (this.timerID) {
      clearInterval(this.timerID);
    }
  }

  calculateTimeLeft(): TimeLeftState {
    const { endDate } = this.props;
    const now = new Date();
    const target = new Date(endDate);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) {
      return {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
    const remaining = diff;

    const seconds = Math.floor((remaining / 1000) % 60);
    const minutes = Math.floor((remaining / (1000 * 60)) % 60);
    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    const days = Math.floor((remaining / (1000 * 60 * 60 * 24)) % 30);
    const months = Math.floor((remaining / (1000 * 60 * 60 * 24 * 30)) % 12);
    const years = Math.floor(remaining / (1000 * 60 * 60 * 24 * 365));

    return { years, months, days, hours, minutes, seconds };
  }

  render() {
    const { years, months, days, hours, minutes, seconds } = this.state;

    return (
      <div>
        Years: {years} | Months: {months} | Days: {days} | Hours: {hours} |
        Minutes: {minutes} | Seconds: {seconds}
      </div>
    );
  }
}
