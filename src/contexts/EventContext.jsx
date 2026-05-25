import { useEffect, useReducer } from "react";
import { EventContext } from "./EventContext.js";
import { supabase } from "../lib/supabase.js";

const initialState = {
  events: [],
};

const reducer = (state, action) => {
  const actions = {
    LOAD_EVENTS: () => ({
      ...state,
      events: action.payload,
    }),

    ADD_EVENT: () => {
      const eventExists = state.events.some(
        (event) =>
          event.title === action.payload.title &&
          event.from === action.payload.from,
      );
      return {
        ...state,
        events: eventExists ? state.events : [...state.events, action.payload],
      };
    },

    DELETE_EVENT: () => ({
      ...state,
      events: state.events.filter((event) => event.id !== action.payload),
    }),
  };

  const handler = actions[action.type];

  if (!handler) {
    throw new Error("Unknown Action");
  }

  // if you wrote handler only
  // it wont execute,
  // its just a referencw to the function
  return handler(state, action);
};

function EventProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { events } = state;

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("from_date", { ascending: true });

      if (error) console.error("Error fetching events:", error);
      else dispatch({ type: "LOAD_EVENTS", payload: data });
    }

    fetchEvents();
  }, []);

  async function addEvent(formObject) {
    const { data, error } = await supabase
      .from("events")
      .insert({
        title: formObject.title,
        from_date: formObject.from,
        to_date: formObject.to,
        type: formObject.type,
      })
      .select()
      .single();

    if (error) console.error("Error adding event:", error);
    else dispatch({ type: "ADD_EVENT", payload: data });
  }

  async function deleteEvent(id) {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) console.error("Error deleting event:", error);
    else dispatch({ type: "DELETE_EVENT", payload: id });
  }

  return (
    <EventContext.Provider value={{ events, deleteEvent, addEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export default EventProvider;
