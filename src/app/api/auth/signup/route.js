import {connectDB} from "../../../../app/lib/db";
import User from "../../../models/User";
import bcrypt, { hash } from "bcryptjs";

export async function POST(req) {
    try{
        await connectDB();
        const {name, email, password} = await req.json();

        //check if user is already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return new Response(JSON.stringify({message: "User already exists"}), {status: 400});
        }
        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        //create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        return new Response(JSON.stringify({message: "User created successfully"}));
    
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({message: "Internal Server Error"}), {status: 500});
    }

}