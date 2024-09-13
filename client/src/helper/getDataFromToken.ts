import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export default function getDataFromToken(request: NextRequest){

    try {
        
        const token = request.cookies.get('token')?.value || '';
       
        const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET!);
      
        return decoded.id;
    } catch (error) {
        
    }

}