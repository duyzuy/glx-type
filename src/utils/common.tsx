export const isPhoneNumber = (str: string) => {
  const regex =
    /^(?:-(?:[0-9](?:\d{0,2}(?:,\d{3})+|\d*))|(?:0|(?:[0-9](?:\d{0,2}(?:,\d{3})+|\d*))))(?:.\d+|)$/;
  return str.match(regex) !== null;
};

export const isNumeric = (str: string) => {
  if (typeof str != "string") return false;
  return !isNaN(Number(str)) || !isNaN(parseFloat(str));
};

export const formatPrice = (price: number, currency = "VND") => {
  const formatter = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  });
  return formatter.format(price);
};
export const addMinutes = (date: Date, minutes: number) => {
  date.setMinutes(date.getMinutes() + minutes);

  return date;
};
export const parseJwt = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const isEmpty = (obj: object) => {
  if (typeof obj === "object") {
    if (Object.keys(obj).length !== 0) {
      return false;
    }
    return true;
  }
};

export const isValidHttpUrl = (str: string) => {
  let url;
  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};
