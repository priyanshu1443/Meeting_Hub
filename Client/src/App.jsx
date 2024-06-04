import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import HomePage from "./components/Home/HomePage";
import CreateMeetingPage from "./components/Home/CreateMeetingPage";
import { createContext, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import JoinMeeting from "./components/Home/JoinMeeting";
import MainMeetingPage from "./components/Home/MainMeetingPage";
import Navbar from "./components/Navbar/Navbar";
export const Progress = createContext();

function App() {
  const [progress, setProgress] = useState(0);

  return (
    <>
      <Router>
        <Progress.Provider value={[progress, setProgress]}>
          <LoadingBar style={{height:"4px"}}
            color="#00A40C"
            progress={progress}
            onLoaderFinished={() => setProgress(0)}
          />
          <Navbar/>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Auth" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/CreateMeeting" element={<CreateMeetingPage />} />
            <Route path="/JoinMeeting" element={<JoinMeeting/>} />
            <Route path="/Meet/:meetingID" element={<MainMeetingPage/>} />
            
          </Routes>
        </Progress.Provider>
      </Router>
    </>
  );
}

export default App;
