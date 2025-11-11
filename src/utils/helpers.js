// src/utils/helpers.js

// ✅ Format price in ₹
export const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

// ✅ Generate random string (used for orderId or temp token)
export const generateRandomString = (length = 8) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// ✅ Scroll to top
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// ✅ Delay function (for async waiting)
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
