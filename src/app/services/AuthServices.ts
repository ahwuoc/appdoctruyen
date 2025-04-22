import { LoginInput } from "@/lib/schema/schema-login";
import apiAuth from "@/app/api/apiRequest/apiAuth";
import { RegisterInput } from "../../lib/schema/schema-register";

export async function loginUser(data: LoginInput) {
  try {
    const result = await apiAuth.login(data);
    return result;
  } catch (err) {
    console.error("Login failed:", err);
    throw err;
  }
}
export async function registerUser(data: RegisterInput) {
  try {
    const result = await apiAuth.register(data);
    return result;
  } catch (err) {
    console.error("Register failed:", err);
    throw err;
  }
}
