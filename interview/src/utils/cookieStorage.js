export const cookieStorage = {
  getItem: (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (!match) {
      console.log("cookieStorage.getItem:", name, null);
      return null;
    }
    try {
      const decoded = decodeURIComponent(match[2]);
      const parsed = JSON.parse(decoded);
      console.log("cookieStorage.getItem:", name, parsed);
      return parsed;
    } catch (error) {
      console.log(
        "cookieStorage.getItem (raw):",
        name,
        decodeURIComponent(match[2])
      );
      return decodeURIComponent(match[2]);
    }
  },

setItem: (name, value) => {
  const stringValue = typeof value === "string" ? value : JSON.stringify(value);
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  document.cookie = `${name}=${encodeURIComponent(stringValue)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  console.log("document.cookie after set:", document.cookie);
},

  removeItem: (name) => {
    console.log("cookieStorage.removeItem:", name);
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  },
};
