import { axiosPrivate } from "../common/axiosPrivate";

export const getAllReport = async (value) =>
{
    
    return await axiosPrivate.post("/api/route.php?service=report", value);

}
