export function validateEmail(email) {
  // Regular expression for a basic email format
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  // Test the email against the regex pattern
  return emailRegex.test(email);
}
