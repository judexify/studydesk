import "./CourseLectureDetails.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { courseData } from "../../data/courseData";
import { supabase } from "../../lib/supabase.js";
import { useAuth } from "../../hooks/useAuth.js";

function CourseLectureDetails() {
  const { courseCode } = useParams();
  const { currentLoggedInUser } = useAuth();
  const isAdmin = currentLoggedInUser?.user_metadata?.role === "admin";
  const decodedCode = courseCode.replace(/-/g, " ");
  const storedLevel = localStorage.getItem("level");
  const courses = courseData[storedLevel]?.courses ?? [];
  const course = courses.find((c) => c.code === decodedCode);

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function fetchNotes() {
      const { data, error } = await supabase
        .from("lecture_notes")
        .select("*")
        .eq("course_code", decodedCode)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching notes:", error);
      else setNotes(data);
    }

    fetchNotes();
  }, [decodedCode]);

  const courseNotes = notes;

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const content = formData.get("content");
    if (!title || !content) return;

    const { data, error } = await supabase
      .from("lecture_notes")
      .insert({
        course_code: decodedCode,
        title,
        content,
        date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) console.error("Error adding note:", error);
    else {
      setNotes((prev) => [data, ...prev]);
      e.currentTarget.reset();
    }
  }

  async function handleDelete(id) {
    const { error } = await supabase
      .from("lecture_notes")
      .delete()
      .eq("id", id);

    if (error) console.error("Error deleting note:", error);
    else setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  if (!course) return <p className="courseNotFound">Course not found.</p>;

  return (
    <div className="courseDetailPage">
      <div className="courseDetailHeader">
        <div className="courseDetailMeta">
          <span className="courseDetailCode">{course.code}</span>
          <span className="courseDetailUnits">{course.units} units</span>
        </div>
        <h2 className="courseDetailTitle">{course.title}</h2>
        <div className="courseDetailInfo">
          <span className="courseDetailLecturer">{course.lecturer}</span>
          {course.schedule[0] && (
            <span className="courseDetailSchedule">
              {course.schedule[0].day} · {course.schedule[0].start} —{" "}
              {course.schedule[0].end}
            </span>
          )}
        </div>
      </div>

      {isAdmin && (
        <form className="noteForm" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Note title e.g. Week 3 - RC Circuits"
            required
          />
          <textarea
            name="content"
            placeholder="Details, reminders, pages to read..."
            rows={4}
            required
          />
          <button type="submit">Log Note</button>
        </form>
      )}

      <div className="notesList">
        {courseNotes.length === 0 ? (
          <p className="notesEmpty">No notes logged yet for this course.</p>
        ) : (
          courseNotes.map((note) => (
            <div key={note.id} className="noteCard">
              <div className="noteCardHeader">
                <span className="noteTitle">{note.title}</span>
                <span className="noteDate">{note.date}</span>
              </div>
              <p className="noteContent">{note.content}</p>
              {isAdmin && (
                <button
                  type="button"
                  className="deleteNoteBtn"
                  onClick={() => handleDelete(note.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CourseLectureDetails;
