import WelcomeCard from "../../components/WelcomeCard/WelcomeCard";
import "./HomePage.css";
import LevelSelector from "../../components/LevelSelector/LevelSelector";
import { useMemo, useState } from "react";
import NextLecture from "../../components/NextLecture/NextLecture";
import ScheduleComponent from "../../components/ScheduleComponent/ScheduleComponent";
import TimeTable from "../../components/TimeTable/TimeTable";
import { courseData } from "../../data/courseData";

function HomePage() {
  const [showModal, setShowModal] = useState(
    () => !localStorage.getItem("level"),
  );

  const storedLevel = localStorage.getItem("level");

  const coursesArr = useMemo(() => {
    return storedLevel ? courseData[storedLevel].courses : [];
  }, [storedLevel]);

  const derivedCourseData = useMemo(() => {
    return storedLevel
      ? coursesArr.filter((course) => course.schedule.length > 0)
      : [];
  }, [coursesArr, storedLevel]);

  return (
    <section>
      <WelcomeCard />
      {showModal && <LevelSelector onSetShowModal={setShowModal} />}
      <div className="dash-grid">
        <NextLecture
          derivedCourseData={derivedCourseData}
          storedLevel={storedLevel}
        />
        <ScheduleComponent />
      </div>
      <TimeTable coursesArr={coursesArr} />
    </section>
  );
}

export default HomePage;
