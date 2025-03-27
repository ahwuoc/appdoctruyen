import http from "../../lib/http";
import { RegisterInput } from '../schema/schema-register';
import { LoginInput } from "../schema/schema-login";


interface RegisterResponse {
    message: string;
}
interface LoginResponse {
    message: string,
    token: string;

}
const apiAuth = {
    register: async (data: RegisterInput) => await http.post<RegisterResponse>('/api/register', { body: data }),
    login: async (data: LoginInput) => await http.post<LoginResponse>('/api/login', { body: data }),
    logout: async () => await http.post('/api/logout')
};



export default apiAuth;
