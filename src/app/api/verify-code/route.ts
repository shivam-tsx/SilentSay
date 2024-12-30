import {dbConnect} from '@/lib/dbConnect';
import UserModel from '@/model/User';

export async function POST(req:Request){
    await dbConnect()

    try {
        const {username,code} = await req.json()
        //url se jo chije aati vo shi se milti nhi hai ,isliye usko decode kr rhe hai
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username:decodedUsername})
        console.log(user)

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message:'user not found',
                },
                { status: 500 }
            );
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                    success: true,
                    message:'Verification code has expired,please signup again',
                },
                { status: 200 }
            ) 
        } else if (!isCodeNotExpired){
            return Response.json(
                {
                    success: false,
                    message:'Account verified successfully',
                },
                { status: 400 }
            ) 
        } else {
            return Response.json(
                {
                    success: false,
                    message:'Invalid verification code',
                },
                { status: 400 }
            ) 
        }

    } catch (error) {
        console.error('Error in verifying user', error);
        return Response.json(
        {
            success: false,
            message: 'Error in verifying user',
        },
        { status: 500 }
        );
    }
}