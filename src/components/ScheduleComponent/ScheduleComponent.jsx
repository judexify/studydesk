import "./ScheduleComponent.css";
import { Link } from "react-router-dom";
import useEvent from "../../hooks/useEvent.js";
import { filterUpcomingEvent } from "../../helpers/getCurrentDayTime.js";
import { FaArrowRight, FaCalendarAlt } from "react-icons/fa";

function ScheduleComponent() {
  const { events } = useEvent();

  const isUpcoming = (to, today) => to >= today;
  const upcomingEvents = filterUpcomingEvent(
    events,
    isUpcoming,
    "to_date",
  ).slice(0, 3);

  return (
    <Link to="/schedule" className="scheduleComponentLink">
      <div className="scheduleComponent">
        <div className="scheduleComponentHeader">
          <div className="scheduleComponentTitle">
            <FaCalendarAlt size={14} />
            <h3>Upcoming Events</h3>
          </div>
          <FaArrowRight size={13} className="scheduleArrow" />
        </div>

        {upcomingEvents.length === 0 ? (
          <p className="scheduleEmpty">No upcoming events</p>
        ) : (
          <ul className="scheduleMiniList">
            {upcomingEvents.map((event) => (
              <li key={event.id} className="scheduleMiniItem">
                <span className="scheduleMiniType">{event.type}</span>
                <span className="scheduleMiniTitle">{event.title}</span>
                <span className="scheduleMiniDate">{event.from_date}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}

export default ScheduleComponent;
