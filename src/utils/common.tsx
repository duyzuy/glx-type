export const isPhoneNumber = (str: string) => {
  const regex =
    /^(?:-(?:[0-9](?:\d{0,2}(?:,\d{3})+|\d*))|(?:0|(?:[0-9](?:\d{0,2}(?:,\d{3})+|\d*))))(?:.\d+|)$/;
  return str.match(regex) !== null;
};
