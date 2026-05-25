import { Link, useNavigate } from "react-router-dom";
import "./TimeTable.css";

function TimeTable({ coursesArr }) {
  const totalUnits = coursesArr.reduce((sum, course) => sum + course.units, 0);
  const navigate = useNavigate();

  return (
    <section className="courses-section">
      <h2>YOUR SEMESTER COURSES</h2>

      <table className="courses-table">
        <thead>
          <tr>
            <th>S/N</th>
            <th>Course code</th>
            <th>Course Title</th>
            <th>Credit Unit</th>
          </tr>
        </thead>

        <tbody>
          {coursesArr.map((course, i) => {
            const formattedCourseCode = course.code.replaceAll(" ", "-");

            return (
              <tr
                key={course.code}
                onClick={() => navigate(`/courses/${formattedCourseCode}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{i + 1}</td>
                <td>{course.code}</td>
                <td>{course.title}</td>
                <td>{course.units}</td>
              </tr>
            );
          })}

          <tr className="total-row">
            <td></td>
            <td>Total</td>
            <td></td>
            <td>{totalUnits}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

export default TimeTable;
