import { getServerSession } from "next-auth"; //is session se ham user ko extract kr skte hai
import { authOptions } from "../../auth/[...nextauth]/option"; //session ko auth-option chahiye hote hai
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(req:Request,{params}:{params:{messageid:string}}){
    const messageId = params.messageid
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user : User = session?.user

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message:'Not authenticated',
            },
            { status: 401 }
        ) 
    }
    try {
        const updateResult = await  UserModel.updateOne(
            {_id: user._id},
            {$pull:{messages:{_id:messageId}}}
        )

        if (updateResult.modifiedCount == 0){
            return Response.json(
                {
                    success: false,
                    message:'message not found or already deleted',
                },
                { status: 400 }
        ) 
        }

    } catch (error) {
        console.log("Error in deleting message",error)
        return Response.json(
            {
                success: false,
                message:'Error deleting messages',
            },
            { status: 400 }
    ) 
    }
    
}