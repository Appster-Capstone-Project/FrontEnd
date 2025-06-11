// src/api/auth.js

export async function loginUser(email, password) {
  // Simulate backend check
  if (email === "test@example.com" && password === "1234") {
    return { message: "Login success (mocked)" };
  } else {
    return { message: "Invalid credentials (mocked)" };
  }
}

export async function registerUser(email, password) {
  // Simulate successful signup
  return { message: `User registered (mocked)` };
}
