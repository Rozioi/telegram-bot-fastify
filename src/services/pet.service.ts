import db, { getData, getAllData } from "../plugins/db";

interface IPet {
    id: number; 
    name: string; 
    species?: string; 
    breed?: string;
    age?: number; 
    user_id: number; 
    second_user_id?: number;
}

export class PetService {
    static async GetPetByUserId(userId: number): Promise<any> {
        const {result , status, error} = await getData<IPet>(db, "SELECT * FROM pets WHERE user_id = ?", [userId])
        if (status !== 1){
            console.error("getData - error:");
			console.error(error);
            return []
        }
        
        return result
    }
}