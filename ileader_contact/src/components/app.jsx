import React, { useState } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";

import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import ListWork from "../pages/ListWork.jsx";
import Notice from "../pages/Notice.jsx";
import DayScorses from "../pages/DayScorses.jsx";
import Register from "../pages/Register.jsx";
import DetailHome from "../pages/DetailHome.jsx";
import TimeTable from "../pages/TimeTable.jsx";
import TranScript from "../pages/TranScript.jsx";
import DetailBranch from "../pages/DetailBranch.jsx";
import Account from "../pages/Account.jsx";
import Reg from "../pages/Reg.jsx";




const MyApp = () => {
  const [tasks, setTasks] = useState([]);
 
  return (
    <RecoilRoot>
      <App>
        <SnackbarProvider>
          <ZMPRouter>
            <AnimationRoutes>
              <Route path="/" element={<Login></Login>}></Route>
              {/* <Route path="/" element={<Home></Home>}></Route> */}

              <Route path="/home" element={<Home />} />
            
              <Route
                path="/notice"
                element={<Notice setTasks={setTasks} tasks={tasks} />}
              />
              <Route path="/listwork" element={<ListWork tasks={tasks} />} />
              <Route path="/dayscorses" element={<DayScorses setTasks={setTasks} tasks={tasks} />} />
              <Route path="/detailhome" element={<DetailHome setTasks={setTasks} tasks={tasks} />} />
              <Route path="/register" element={<Register setTasks={setTasks} tasks={tasks} />} />
              <Route path="/timetable" element={<TimeTable setTasks={setTasks} tasks={tasks} />} />
              <Route path="/transcript" element={<TranScript setTasks={setTasks} tasks={tasks} />} />
              <Route path="/detailbranch" element={<DetailBranch setTasks={setTasks} tasks={tasks} />} />
              <Route path="/account" element={<Account setTasks={setTasks} tasks={tasks} />} />
              <Route path="/reg" element={<Reg setTasks={setTasks} tasks={tasks} />} />

            </AnimationRoutes>
          </ZMPRouter>
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};
export default MyApp;
