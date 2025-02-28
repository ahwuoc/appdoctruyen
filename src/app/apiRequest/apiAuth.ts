import { string } from "zod";
import http from "../../lib/http";

import { RegisterInput } from '../schema/schema-register';
import { message } from "antd";
import { LoginInput } from "../schema/schema-login";


interface RegisterResponse {
    message:string
}
interface LoginResponse {
    message:string,
    token:string

}
const apiAuth ={
    register: async (data:RegisterInput) => await http.post<RegisterResponse>('/api/register',{body : JSON.stringify(data)}),
    login: async(data:LoginInput) => await http.post<LoginResponse>('/api/login',{body:JSON.stringify(data)}),
 }



 export default apiAuth;
