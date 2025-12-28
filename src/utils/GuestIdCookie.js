
export const MakeCookie = (days) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000); // أيام انتهاء الصلاحية
  document.cookie = `guest_id=${crypto.randomUUID()};expires=${expires.toUTCString()};path=/`;
};


export const GetCookie = () => {
  const nameEQ = "guest_id" + "=";
  const ca = document.cookie.split(";"); // نفصل كل الكوكيز
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }
  return null; // لو مفيش كوكي باسم ده
};

export const DeleteCookie = () => {
  document.cookie = "guest_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};
