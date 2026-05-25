export const getCurrentDay = function () {
  const date = new Date();
  const day = date.getDay();
  return day;
};

export const filterUpcomingEvent = function (
  arr,
  comparator,
  field = "to_date",
) {
  const today = new Date().toISOString().split("T")[0];
  return arr.filter((event) => comparator(event[field], today));
};
