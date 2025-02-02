import { text } from "express";

export function mensaje(status,mensajeUsuario,mensajeOriginal="",token=""){
    return{
        status, 
        mensajeUsuario,
        mensajeOriginal,
        token
    }
}