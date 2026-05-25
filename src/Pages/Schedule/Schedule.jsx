import "./Schedule.css";
import useEvent from "../../hooks/useEvent.js";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { filterUpcomingEvent } from "../../helpers/getCurrentDayTime.js";
import { useAuth } from "../../hooks/useAuth.js";

function Schedule() {
  const [query, setQuery] = useState("");
  const { events, deleteEvent, addEvent } = useEvent();
  const { currentLoggedInUser } = useAuth();
  const isAdmin = currentLoggedInUser?.user_metadata?.role === "admin";

  function handleInput(e) {
    setQuery(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("submit fired");
    const formData = new FormData(e.currentTarget);

    const newEvent = {
      title: formData.get("title"),
      from_date: formData.get("from"),
      to_date: formData.get("to"),
      type: formData.get("type"),
    };

    if (!newEvent.title || !newEvent.from_date || !newEvent.to_date) return;

    addEvent(newEvent);
    e.currentTarget.reset();
  }

  const isUpcoming = (to, today) => to >= today;
  const isPast = (to, today) => to < today;

  const upcomingEvents = filterUpcomingEvent(events, isUpcoming, "to_date");
  const pastEvents = filterUpcomingEvent(events, isPast, "to_date");

  return (
    <section className="scheduleSection">
      <input
        type="text"
        className="searchQuery"
        placeholder="Search festivals, exams, holidays..."
        value={query}
        onChange={handleInput}
      />

      {isAdmin && (
        <form className="addScheduleForm" onSubmit={handleSubmit}>
          <label className="formLabel">
            Enter your upcoming event
            <input
              type="text"
              name="title"
              placeholder="e.g. Ileya Festival"
              required
            />
          </label>

          <div className="dateRange">
            <label>
              From
              <input type="date" name="from" required />
            </label>
            <label>
              To
              <input type="date" name="to" required />
            </label>
          </div>

          <input
            type="text"
            name="type"
            placeholder="Event type (e.g. Festival, Exam, Holiday)"
            required
          />

          <button type="submit">Add to Schedule</button>
        </form>
      )}

      <div className="scheduleCategory">
        <div className="upcomingActivity">
          <h3>Upcoming</h3>
          <ul className="eventList">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <li key={event.id} className="eventCard">
                  <div className="eventCardContent">
                    <div className="eventMeta">
                      <span className="eventType">{event.type}</span>
                    </div>
                    <p className="eventTitle">{event.title}</p>
                    <div className="eventRange">
                      <span>{event.from_date}</span>
                      <span className="rangeSep">→</span>
                      <span>{event.to_date}</span>
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      type="button"
                      className="deleteEventBtn"
                      onClick={() => deleteEvent(event.id)}
                      aria-label="Delete event"
                    >
                      <FaTrash size={18} />
                    </button>
                  )}
                </li>
              ))
            ) : (
              <p>No Upcoming Events</p>
            )}
          </ul>
        </div>

        <div className="pastActivity">
          <h3>Past</h3>
          <ul className="eventList">
            {pastEvents.map((event) => (
              <li key={event.id} className="eventCard">
                <div className="eventCardContent">
                  <div className="eventMeta">
                    <span className="eventType">{event.type}</span>
                  </div>
                  <p className="eventTitle">{event.title}</p>
                  <div className="eventRange">
                    <span>{event.from}</span>
                    <span className="rangeSep">→</span>
                    <span>{event.to}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="deleteEventBtn"
                  onClick={() => deleteEvent(event.id)}
                  aria-label="Delete event"
                >
                  <FaTrash size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Schedule;
