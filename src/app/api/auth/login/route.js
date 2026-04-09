import {connectDB} from "@/app/lib/db"; 
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req){
    try{
      await connectDB();
     const { email, password } = await req.json();

    // check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Invalid credentials" }),
        { status: 400 }
      );
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
        return new Response(JSON.stringify({message: "Invalid credentials"}), {status: 400});
      }
      const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET_KEY, {
        expiresIn: '7d',
      });
      return new Response(JSON.stringify({ message: 'Login successful', token }), { status: 200 });
    }
    catch(error){
        console.error(error);
        return new Response(JSON.stringify({message: "Internal Server Error"}), {status: 500}); 
    }
}