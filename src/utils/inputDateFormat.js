export function dateInput(val) {
  const date = new Date(val);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}` || null;
}

export function dateInputTime(val) {
  const date = new Date(val);

  const year = "2019";
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);

  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
  return formattedDate;
}
