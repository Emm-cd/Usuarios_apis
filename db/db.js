import mongoose from "mongoose";
import { mensaje } from "../libs/mensajes.js";

export async function conectarDB() {
    try {
        //const conexion = await mongoose.connect("mongodb+srv://Emma:LqTCVoxTYqsPSfRI@cluster0.py7d4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        const conexion = await mongoose.connect("mongodb://localhost:27017/MongoDBApp");
        //console.log(conexion);
        //console.log("Conexión correcta a mongoDB");
        return mensaje(200,"Conexion correcta");
                
    } catch (error) {
        return mensaje(400,"Error al conectarse a la BD",error);
    }
}

