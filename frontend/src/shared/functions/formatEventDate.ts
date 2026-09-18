export function formatEventDate(startTime: string) {
  const startDate = new Date(startTime);

  const date = startDate.toLocaleDateString("sr-Latn-RS", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const time = startDate.toLocaleTimeString("sr-RS", {
    hour: "2-digit",
    minute: "2-digit",
  });

  //return `${date} - ${time}`;

  return { date, time };
}
