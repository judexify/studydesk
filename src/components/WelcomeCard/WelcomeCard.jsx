import "./WelcomeCard.css";
import { useAuth } from "../../hooks/useAuth";
import readingcardsvg from "../../assets/reading-a-book.svg";
import { useEffect, useState } from "react";

const SEMESTER_START = new Date("2026-05-15");

const weekSchedule = [
  { week: 1, dates: "May 15–17", mode: "Physical", holiday: false },
  { week: 2, dates: "May 22–24", mode: "Virtual", holiday: false },
  { week: 3, dates: "May 29–31", mode: null, holiday: true, label: "Holiday" },
  { week: 4, dates: "Jun 5–7", mode: "Physical", holiday: false },
  { week: 5, dates: "Jun 12–14", mode: "Virtual", holiday: false },
  { week: 6, dates: "Jun 19–21", mode: "Physical", holiday: false },
  { week: 7, dates: "Jun 26–28", mode: "Physical", holiday: false },
  { week: 8, dates: "Jul 3–5", mode: "Virtual", holiday: false },
  { week: 9, dates: "Jul 10–12", mode: "Physical", holiday: false },
  { week: 10, dates: "Jul 17–19", mode: "Virtual", holiday: false },
  {
    week: 11,
    dates: "Jul 24–26",
    mode: null,
    holiday: true,
    label: "Free Week",
  },
  {
    week: 12,
    dates: "Jul 31–Aug 2",
    mode: "Physical",
    holiday: false,
    exam: true,
  },
  { week: 13, dates: "Aug 7–9", mode: "Physical", holiday: false, exam: true },
  {
    week: 14,
    dates: "Aug 14–16",
    mode: "Physical",
    holiday: false,
    exam: true,
  },
  {
    week: 15,
    dates: "Aug 21–23",
    mode: "Physical",
    holiday: false,
    exam: true,
  },
  {
    week: 16,
    dates: "Aug 28–30",
    mode: "Physical",
    holiday: false,
    exam: true,
    label: "CBT Exam",
  },
];

function getCurrentWeekInfo() {
  const today = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weekIndex = Math.floor((today - SEMESTER_START) / msPerWeek);

  if (weekIndex < 0) return { label: "Semester hasn't started yet", sub: "" };
  if (weekIndex >= weekSchedule.length)
    return { label: "Semester is over", sub: "" };

  const current = weekSchedule[weekIndex];

  if (current.holiday)
    return {
      label: current.label || "Holiday Week",
      sub: `Week ${current.week} · ${current.dates} · No classes`,
    };

  if (current.exam)
    return {
      label: current.label || "Examination Week",
      sub: `Week ${current.week} · ${current.dates} · Physical · Good luck!`,
    };

  return {
    label: `${current.mode} Classes This Week`,
    sub: `Week ${current.week} · ${current.dates} · ${current.mode === "Physical" ? "See you on campus 🏫" : "Join online 💻"}`,
  };
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const fallbackQuotes = [
  {
    content:
      "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King",
  },
  {
    content:
      "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    author: "Malcolm X",
  },
  {
    content: "The more that you read, the more things you will know.",
    author: "Dr. Seuss",
  },
  {
    content: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
  },
  {
    content: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
  },
];

function WelcomeCard() {
  const { currentLoggedInUser } = useAuth();
  const { label, sub } = getCurrentWeekInfo();
  const greeting = getGreeting();

  const [quote, setQuote] = useState(null);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const res = await fetch(
          "https://api.quotable.io/random?tags=education|motivational&maxLength=120",
        );
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setQuote({ content: data.content, author: data.author });
      } catch {
        const random =
          fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        setQuote(random);
      }
    }

    fetchQuote();
  }, []);

  return (
    <div className="welcomeCard-wrapper">
      <div className="welcomeCard">
        <div className="card-text">
          <h2 className="username">
            {greeting},&nbsp;
            <span>{currentLoggedInUser?.user_metadata?.name}</span>
          </h2>
          <p className="weekLabel">{label}</p>
          <p className="weekSub">{sub}</p>
          {quote && (
            <blockquote className="welcomeQuote">
              <p>"{quote.content}"</p>
              <cite>— {quote.author}</cite>
            </blockquote>
          )}
        </div>
        <div className="card-visual">
          <img src={readingcardsvg} alt="svg of a character reading book" />
        </div>
      </div>
    </div>
  );
}

export default WelcomeCard;
