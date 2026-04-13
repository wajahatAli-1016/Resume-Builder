import { connectDB } from "../../../../app/lib/db";
import User from "../../../models/User";
import bcrypt, { hash } from "bcryptjs";

export async function POST(req) {
    try {
        await connectDB();
        const { name, email, password } = await req.json();

        //email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return new Response(
                JSON.stringify({ message: "Invalid email format" }),
                { status: 400 }
            );
        }
        const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];
        const domain = email.split("@")[1].toLowerCase();

        if (!allowedDomains.includes(domain)) {
            return new Response(
                JSON.stringify({ message: "Please use a valid email provider" }),
                { status: 400 }
            );
        }
        //check if user is already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
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
        return new Response(JSON.stringify({ message: "User created successfully" }));

    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }

}
