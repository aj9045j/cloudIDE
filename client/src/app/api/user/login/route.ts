import { connect } from "@/dbconfig/dbconfig";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
    

    try {
        const { email, password } = await request.json();
        
        const user = await User.findOne({email});

        if(!user){
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        const validate = await bcrypt.compare(password,user.password);

        if(!validate)  return NextResponse.json({error:"incorrect password"},{status: 401});
    
        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "4d"});

        console.log(token);

        const response = NextResponse.json({message: "success login"});

        response.cookies.set("token",token, {
            httpOnly: true,
        })

        return response;
        
    } catch (error: any) {
        return NextResponse.json({error: error.message},{status:500})
    }

}