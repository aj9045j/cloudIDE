import { connect } from "@/dbconfig/dbconfig";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { sendmail } from "@/helper/mailer";

export async function POST(request: NextRequest) {
    try {
        // Ensure connection is established
        await connect();

        // Parse JSON request body
        const reqBody = await request.json();
        const { username, email, password } = reqBody;
        console.log(reqBody);

        // Check if the user already exists
        const user = await User.findOne({ email });

        if (user) {
            console.log("User already registered");
            return NextResponse.json(
                { error: "User already registered" },
                { status: 400 }
            );
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save new user
        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();

        console.log(savedUser);

        await sendmail({email, emailType: 'VERIFY', userId: savedUser._id});

        return NextResponse.json({
            message: "User registered successfully",
            success: true,
            user: savedUser,
        });
    } catch (error) {
        console.error('Error:', error); // Log the error for debugging
        return NextResponse.json(
            {
                error: error || 'Internal Server Error',
            },
            { status: 500 }
        );
    }
}
