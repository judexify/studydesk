import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// import Login from "./Pages/Login/Login";
// import HomePage from "./Pages/HomePage/HomePage";
// import Courses from "./Pages/Courses/Courses";
// import Assignments from "./Pages/Assignments/Assignments";
// import Schedule from "./Pages/Schedule/Schedule";
// // import StudyLog from "./Pages/StudyLog/StudyLog.jsx";
// import AppLayout from "./Pages/AppLayout";

const HomePage = lazy(() => import("./Pages/HomePage/HomePage"));
const Courses = lazy(() => import("./Pages/Courses/Courses"));
const Assignments = lazy(() => import("./Pages/Assignments/Assignments"));
const Login = lazy(() => import("./Pages/Login/Login"));
const Schedule = lazy(() => import("./Pages/Schedule/Schedule"));
const AppLayout = lazy(() => import("./Pages/AppLayout"));

import CourseLectureDetails from "./components/CourseLectureDetails/CourseLectureDetails.jsx";
import SpinnerFullPage from "./components/SpinnerFullPage/SpinnerFullPage.jsx";

import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoutes from "./Pages/ProtectedRoutes.jsx";
import EventProvider from "./contexts/EventContext.jsx";

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<Navigate replace to="login" />} />
              <Route path="login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoutes>
                    <AppLayout />
                  </ProtectedRoutes>
                }
              >
                <Route index element={<Navigate replace to="dashboard" />} />
                <Route path="dashboard" element={<HomePage />} />
                <Route path="courses" element={<Courses />} />
                <Route
                  path="courses/:courseCode"
                  element={<CourseLectureDetails />}
                />
                {/* <Route path="study-log" element={<StudyLog />} /> */}
                <Route path="assignments" element={<Assignments />} />
                <Route path="schedule" element={<Schedule />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
