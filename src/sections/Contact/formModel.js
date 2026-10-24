/* Form state shape + per-step validation. Pure functions, no React. */
export const INITIAL = {
  projectType: "", description: "",
  name: "", email: "", phone: "", budget: "Not sure yet",
  estimate: "", // text summary from the pricing calculator
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d\s.-]{8,20}$/;

/** Each validator returns { fieldName: message }. Empty object = step is valid. */
export const VALIDATORS = [
  (v) => {
    const e = {};
    if (!v.description.trim()) e.description = "Tell me briefly what you're building.";
    else if (v.description.trim().length < 15) e.description = "Add a little more detail (a sentence is enough).";
    return e;
  },
  (v) => {
    const e = {};
    if (!v.name.trim()) e.name = "Enter your name.";
    if (!v.email.trim()) e.email = "Enter your email address.";
    else if (!EMAIL.test(v.email.trim())) e.email = "Enter a valid email, like name@company.com.";
    if (v.phone.trim() && !PHONE.test(v.phone.trim())) e.phone = "Enter a valid phone number, like +213 5xx xx xx xx.";
    return e;
  },
];
