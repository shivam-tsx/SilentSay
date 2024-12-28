import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2, "username must be atleast two characters")
    .max(20, "username cannot contain more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username cannot contain special characters");

export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:'Invalid email address'}),
    password:z.string().min(6,{message:"password must be atleast 6 characters"})
})