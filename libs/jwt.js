import jwt from "jsonwebtoken";
import {mensaje} from "../libs/mensajes.js";
import 'dotenv/config';

export function crearToken (dato){
    return new Promise((resolve,reject)=>{
        jwt.sign(
            dato,
            process.env.SECRET_TOKEN,
            {
                expiresIn:"1d"
            },
            (err,token)=>{
                if(err){
                    reject(mensaje(400,"Error al generar el token"));
                }
                    resolve(token);            
            }
        );
    });
}