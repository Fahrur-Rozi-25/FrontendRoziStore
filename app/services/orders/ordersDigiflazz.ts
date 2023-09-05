
import axios from "axios";
import { config } from "dotenv";
config();

export const OrderDigiflazz = async (encryptedData: string, password: string , urls:any): Promise<any> => {

    const url = `/api/ordersDigiflazz/${urls}`;
    console.log(url);
    
    const data = {
        data: encryptedData,
    };
    const passwords = "250106"
    
    if (password === passwords) {
        try {
            const response = await axios.post(url, data);
            const resData = response.data
            return resData;
        } catch (error:any) {
            return { error: "error", message: error };
        }
        
    } else {
        return "PASSWORD SALAH"
    }
};
