import "./Assignments.css";
import { useState, useEffect } from "react";
import { courseData } from "../../data/courseData";
import { FaTrash } from "react-icons/fa";
import { supabase } from "../../lib/supabase.js";
import { useAuth } from "../../hooks/useAuth.js";

function getStatus(assignment) {
  if (assignment.submitted) return "submitted";
  const today = new Date().toISOString().split("T")[0];
  if (assignment.due_date < today) return "overdue";
  return "pending";
}

function Assignments() {
  const { currentLoggedInUser } = useAuth();
  const isAdmin = currentLoggedInUser?.user_metadata?.role === "admin";
  const storedLevel = localStorage.getItem("level");
  const courses = courseData[storedLevel]?.courses ?? [];

  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    async function fetchAssignments() {
      const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .order("due_date", { ascending: true });

      if (error) console.error("Error fetching assignments:", error);
      else setAssignments(data);
    }

    fetchAssignments();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const course_code = formData.get("courseCode");
    const due_date = formData.get("dueDate");
    const details = formData.get("details");

    if (!title || !course_code || !due_date) return;

    const { data, error } = await supabase
      .from("assignments")
      .insert({
        course_code,
        title,
        details: details || null,
        due_date,
        submitted: false,
      })
      .select()
      .single();

    if (error) console.error("Error adding assignment:", error);
    else {
      setAssignments((prev) => [...prev, data]);
      e.currentTarget.reset();
    }
  }

  async function handleDelete(id) {
    const { error } = await supabase.from("assignments").delete().eq("id", id);

    if (error) console.error("Error deleting assignment:", error);
    else setAssignments((prev) => prev.filter((a) => a.id !== id));
  }

  async function handleToggleSubmit(id, current) {
    const { error } = await supabase
      .from("assignments")
      .update({ submitted: !current })
      .eq("id", id);

    if (error) console.error("Error updating assignment:", error);
    else
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, submitted: !current } : a)),
      );
  }

  const pending = assignments.filter((a) => getStatus(a) === "pending");
  const overdue = assignments.filter((a) => getStatus(a) === "overdue");
  const submitted = assignments.filter((a) => getStatus(a) === "submitted");

  return (
    <div className="assignmentsPage">
      {isAdmin && (
        <form className="assignmentForm" onSubmit={handleSubmit}>
          <h3 className="assignmentFormTitle">Log Assignment</h3>

          <select name="courseCode" required defaultValue="">
            <option value="" disabled>
              Select course
            </option>
            {courses.map((course) => (
              <option key={course.code} value={course.code}>
                {course.code} — {course.title}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="title"
            placeholder="Assignment title"
            required
          />

          <textarea
            name="details"
            placeholder="Details, page numbers, instructions... (optional)"
            rows={3}
          />

          <label className="dueDateLabel">
            Due date
            <input type="date" name="dueDate" required />
          </label>

          <button type="submit">Add Assignment</button>
        </form>
      )}

      <div className="assignmentLists">
        <AssignmentGroup
          title="Pending"
          assignments={pending}
          status="pending"
          onDelete={handleDelete}
          onToggleSubmit={handleToggleSubmit}
          isAdmin={isAdmin}
        />
        <AssignmentGroup
          title="Overdue"
          assignments={overdue}
          status="overdue"
          onDelete={handleDelete}
          onToggleSubmit={handleToggleSubmit}
          isAdmin={isAdmin}
        />
        <AssignmentGroup
          title="Submitted"
          assignments={submitted}
          status="submitted"
          onDelete={handleDelete}
          onToggleSubmit={handleToggleSubmit}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}

function AssignmentGroup({
  title,
  assignments,
  status,
  onDelete,
  onToggleSubmit,
  isAdmin,
}) {
  return (
    <div className="assignmentGroup">
      <h3 className={`assignmentGroupTitle ${status}`}>
        {title} ({assignments.length})
      </h3>
      {assignments.length === 0 ? (
        <p className="assignmentEmpty">No {title.toLowerCase()} assignments</p>
      ) : (
        <ul className="assignmentList">
          {assignments
            .toSorted((a, b) => a.due_date.localeCompare(b.due_date))
            .map((assignment) => (
              <li key={assignment.id} className={`assignmentCard ${status}`}>
                <div className="assignmentCardHeader">
                  <span className="assignmentCourse">
                    {assignment.course_code}
                  </span>
                  <span className="assignmentDue">{assignment.due_date}</span>
                </div>
                <p className="assignmentTitle">{assignment.title}</p>
                {assignment.details && (
                  <p className="assignmentDetails">{assignment.details}</p>
                )}
                {isAdmin && (
                  <div className="assignmentCardFooter">
                    <label className="submitToggle">
                      <input
                        type="checkbox"
                        checked={assignment.submitted}
                        onChange={() =>
                          onToggleSubmit(assignment.id, assignment.submitted)
                        }
                      />
                      Mark as submitted
                    </label>
                    <button
                      type="button"
                      className="deleteAssignmentBtn"
                      onClick={() => onDelete(assignment.id)}
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default Assignments;
