import { FaLeftLong, FaRightLong } from "react-icons/fa6";
import "./NextLecture.css";
import { memo, useEffect, useRef, useState } from "react";

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function NextLecture({ derivedCourseData, storedLevel }) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  });

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    }, 60000);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!trackRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      const isMobile = window.innerWidth <= 768;
      setCardWidth(isMobile ? width : width / 2);
    });
    observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, []);

  const now = new Date();
  const day = now.getDay();

  function getLecturesByDay(dayIndex) {
    return derivedCourseData
      .filter((course) => course.schedule.at(0)?.day === weekdays[dayIndex])
      .toSorted((a, b) => {
        const timeA = a.schedule?.[0]?.start || "";
        const timeB = b.schedule?.[0]?.start || "";
        return timeA.localeCompare(timeB);
      });
  }

  const todayLectures = getLecturesByDay(day);

  const nextDayWithLectures = (() => {
    for (let i = 1; i <= 6; i++) {
      const nextIndex = (day + i) % 7;
      const lectures = getLecturesByDay(nextIndex);
      if (lectures.length > 0) return { dayIndex: nextIndex, lectures };
    }
    return null;
  })();

  const displayLectures =
    todayLectures.length > 0
      ? todayLectures
      : (nextDayWithLectures?.lectures ?? []);

  const activeLecture = todayLectures.find(
    (course) =>
      currentTime >= course.schedule[0]?.start &&
      currentTime <= course.schedule[0]?.end,
  );

  const upcomingLecture = todayLectures.find(
    (course) => currentTime < course.schedule[0]?.start,
  );

  if (!storedLevel) return null;

  function handleLeft() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function handleRight() {
    const isMobile = window.innerWidth <= 768;
    const max = isMobile
      ? displayLectures.length - 1
      : displayLectures.length - 2;
    setIndex((i) => Math.min(Math.max(0, max), i + 1));
  }

  return (
    <div className="nextLectureWrapper">
      <div className="lecture-nav">
        <span className="lecture-nav-title">
          {activeLecture
            ? `Ongoing: ${activeLecture.code} — ends ${activeLecture.schedule[0]?.end}`
            : upcomingLecture
              ? `Next: ${upcomingLecture.code} at ${upcomingLecture.schedule[0]?.start}`
              : nextDayWithLectures
                ? `Next lecture is ${weekdays[nextDayWithLectures.dayIndex]} at ${nextDayWithLectures.lectures[0].schedule[0]?.start} — ${nextDayWithLectures.lectures[0].code}`
                : "No more lectures this week"}
        </span>
        <div className="lecture-nav-buttons">
          <button onClick={handleLeft} disabled={index === 0}>
            <FaLeftLong size={14} />
          </button>
          <button
            onClick={handleRight}
            disabled={index >= displayLectures.length - 2}
          >
            <FaRightLong size={14} />
          </button>
        </div>
      </div>
      <div className="nextLecture-track" ref={trackRef}>
        <UpcomingLecture
          sortedCourseData={displayLectures}
          index={index}
          cardWidth={cardWidth}
          currentTime={currentTime}
        />
      </div>
    </div>
  );
}

const UpcomingLecture = memo(function UpcomingLecture({
  sortedCourseData,
  index,
  cardWidth,
  currentTime,
}) {
  return (
    <div
      className="nextLecture"
      style={{ transform: `translateX(-${index * (cardWidth + 6)}px)` }}
    >
      {sortedCourseData.map((course) => (
        <div
          key={course.code}
          className={`lecture-card ${
            currentTime >= course.schedule[0]?.start &&
            currentTime <= course.schedule[0]?.end
              ? "currentActive"
              : "notActive"
          }`}
        >
          <div className="lecture-card-header">
            <span className="course-code">{course.code}</span>
            <span className="course-day">{course.schedule[0]?.day}</span>
          </div>
          <p className="course-title">{course.title}</p>
          <div className="lecture-card-footer">
            <span className="course-time">
              {course.schedule[0]?.start} — {course.schedule[0]?.end}
            </span>
            <span className="course-lecturer">{course.lecturer}</span>
          </div>
        </div>
      ))}
    </div>
  );
});

export default NextLecture;
