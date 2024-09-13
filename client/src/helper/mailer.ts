import nodemailer from 'nodemailer';
import bcrypt from "bcryptjs";
import User from '@/models/userModel';


export const sendmail = async ({ email, emailType, userId }: any) => {

    try {

        const hashToken = await bcrypt.hash(userId.toString(), 10);

        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId, {
                verificationToken: hashToken,
                verificationTokenExpiration: Date.now() + 5 * 60 * 1000,
            })
        } else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId, {
                resetToken: hashToken,
                resetTokenExpiration: Date.now() + 5 * 60 * 1000,
            })
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "0bb3768fcc6bbc",
                pass: "1c822272be0fc1"
            }
        });

        const mailOption = {
            from: 'aj9045j@gmail.com',
            to: email,
            subject: emailType === 'VERIFY' ? 'verify your email' : 'Reset your password',
            html: `<p>click on this <a href="${process.env.DOMAIN}/verifyemail?token=${hashToken}" /> to ${
                emailType === 'VERIFY' ? 'verify your email' : 'Reset your password'
            }</p>`
            
        }

        const mailResponse = await transport.sendMail(mailOption);

        return mailResponse;


    } catch (error: any) {
        throw new Error(error.message);
    }

}