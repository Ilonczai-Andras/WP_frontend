export function getFormattedDateFromNumberArray(
  dateParts: string | (string | number)[] | undefined,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  let dateString: string = '';

  if (dateParts && dateParts.length >= 7) {
    const date = new Date(
      Number(dateParts[0]),
      Number(dateParts[1]) - 1,
      Number(dateParts[2]),
      Number(dateParts[3]),
      Number(dateParts[4]),
      Number(dateParts[5]),
      Math.floor(Number(dateParts[6]) / 1e6)
    );

    dateString = date.toLocaleDateString(locale, options);
  }

  return dateString;
}
