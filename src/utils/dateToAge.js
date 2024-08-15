export function dateToAge(timestamp) {
  const birthDate = new Date(timestamp);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - birthDate.getFullYear();

  const birthMonth = birthDate.getMonth();
  const currentMonth = currentDate.getMonth();
  const birthDay = birthDate.getDate();
  const currentDay = currentDate.getDate();

  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }

  return age;
}
