import mongoose from "mongoose";

//database ke connection k bad jo object aarha hai uska type kya hai
type ConnectionObject = {
    isConnected?:number
}

const connection:ConnectionObject = {}

export async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already connected connected to Database")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '',{})

        connection.isConnected = db.connections[0].readyState //returns number
        
        console.log("Database connected successfully")

    } catch (error) {
        console.log("Database connection failed",error)
        process.exit(1)
    }
}