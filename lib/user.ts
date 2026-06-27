// Local user stub — no real auth in this demo. Swap this out for a real session
// when the funnel graduates past concept stage.
export const currentUser = {
  name: "Alex",
  fullName: "Alex Degryse",
  email: "alex@example.com",
  plan: "Free",
} as const;

/** Time-of-day greeting used on the dashboard. */
export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
