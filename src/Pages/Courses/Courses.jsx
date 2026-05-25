import "./Courses.css";
import { courseData } from "../../data/courseData";
import { Link } from "react-router-dom";

const dayOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function Courses() {
  const storedLevel = localStorage.getItem("level");

  const courses = (courseData[storedLevel]?.courses ?? []).toSorted((a, b) => {
    const dayA = a.schedule[0]?.day ? dayOrder.indexOf(a.schedule[0].day) : 99;
    const dayB = b.schedule[0]?.day ? dayOrder.indexOf(b.schedule[0].day) : 99;
    return dayA - dayB;
  });

  return (
    <div className="coursesGrid">
      <p className="courses-offered">
        You offer {courses.length} Courses, {""} click on each card to know
        whats up
      </p>
      {courses.map((course) => (
        <Link
          to={`/courses/${course.code.replace(/\s+/g, "-")}`}
          key={course.code}
          className="courseCardLink"
        >
          <div className="courseCard">
            <div className="courseCardHeader">
              <span className="courseCode">{course.code}</span>
              <span className="courseUnits">{course.units} units</span>
            </div>
            <p className="courseTitle">{course.title}</p>
            <div className="courseCardFooter">
              <span className="courseLecturer">{course.lecturer}</span>
              <div className="courseScheduleInfo">
                <span className="courseDay">
                  {course.schedule[0]?.day ?? "TBA"}
                </span>
                {course.schedule[0]?.start && (
                  <span className="courseTime">
                    {course.schedule[0].start} — {course.schedule[0].end}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Courses;
