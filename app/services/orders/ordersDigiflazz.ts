
import axios from "axios";

export const OrderDigiflazz = async (encryptedData: any, password: string , Debt:any): Promise<any> => {

    // const url = `/api/ordersDigiflazz/${urls}`;
    const url = `https://rozistorebe.tokorozy.my.id/senddataorder`;
    // const url = `http://localhost:3000/senddataorder`;

    const data = {
        data: encryptedData ,
        validation: "01_ROZISTORE_VALIDATION_CODE0899",
    };
    console.log(data);
    
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
