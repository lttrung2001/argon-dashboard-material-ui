import axios, { AxiosInstance } from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";

const apiHelper = axios.create({
    baseURL: "http://localhost:8080/",
    headers: {
        "Content-Type": "application/json"
    },
});

export default () => {
    // apiHelper.interceptors.request.use((config) => {
    //     config.baseURL = "http://localhost:8080/"
    //     const accessToken = localStorage.getItem(ACCESS_TOKEN)
    //     if (accessToken != null) {
    //         const decoded = jwtDecode<JwtPayload>(accessToken)
    //         if (decoded.exp && decoded.exp < Date.now()) {
    //             throw Error(MESSAGE_INVALID_TOKEN)
    //         }
    //         config.headers.Authorization = `Bearer ${accessToken}`
    //         console.log(`$ADD TOKEN: ${config.headers.Authorization}`)
    //         return config
    //     }
    //     throw Error(MESSAGE_INVALID_TOKEN)
    // }, (error) => {
    //     console.log(`$INTERCEPTOR ERROR: ${error}`)
    //     localStorage.clear()
    //     throw Error(MESSAGE_INVALID_TOKEN)
    // })
    
    apiHelper.interceptors.response.use((response) => {
        console.log(response);
        return response;
    })
    return apiHelper;
}

export const ACCESS_TOKEN = "ACCESS_TOKEN";