
import getDataFromToken from "@/helper/getDataFromToken";
import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest){
    try {
        
        const userId = await getDataFromToken(request);
        // console.log(userId);
        const user = await User.findOne({_id: userId});
        return NextResponse.json({
            message: "User found",
            data: user
        })
    } catch (error) {
        
        return NextResponse.json({error: "user not found"},{status:404});
    }
}