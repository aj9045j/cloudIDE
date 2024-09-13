import mongoose from 'mongoose';


export async function connect(){

    try {
        

        mongoose.connect(process.env.MONGO_URL!);
        const connection = mongoose.connection;

        connection.on('connected',()=>{
            console.log("MONGO CONNECTED");
        })

    } catch (error) {
        console.log('mongo error '+ error);
        process.exit();
    }

}