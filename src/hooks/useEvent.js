import { useContext } from "react";
import { EventContext } from "../contexts/EventContext";

function useEvent() {
  const context = useContext(EventContext);
  if (context === undefined)
    throw new Error("EventContext was used outside EventProvider");
  return context;
}
export default useEvent;
