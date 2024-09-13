
import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    

    try {
        

        const {token} = await request.json();
        const user = await User.findOne({verificationToken: token,verificationTokenExpiration: {$gt: Date.now()}});

        if(!user){
            return NextResponse.json({message: "Invalid user"},{status: 404});

        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiration = undefined;
        await user.save();

        return NextResponse.json({
            message: "user verify successfully",
            success: true
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message},{status:500});
    }

}