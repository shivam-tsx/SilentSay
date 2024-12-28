import mongoose,{Schema,Document} from "mongoose";
/*
1.Extending the Document interface allows TypeScript to recognize mongoose methods when working
with MongoDB documents.
2.When you define an interface for a Mongoose schema, it needs to extend Document to ensure TypeScript 
understands that the object is a Mongoose document and not just a plain JavaScript object.
3.Mongoose documents include additional fields like _id, __v, etc. By extending Document, your interface
automatically includes these fields.
*/
export interface Message extends Document{
    content:string,
    createdAt:Date
}

const MessageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[];
}

const UserSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
            "please use a valid email address"
        ]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    verifyCode:{
        type:String,
        required:[true,"Verification code is required"]
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify code expiry is required"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
})

// jo return type aane wala hai vo mongoose ke jo model hai us type ka ayega , uska jo type hai vo user hai
const UserModel = (mongoose.models.User as mongoose.Model<User>)  || (mongoose.model<User>("User",UserSchema))
export default UserModel