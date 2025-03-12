import crypto from "crypto";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { mensaje } from "../libs/mensajes.js";
import { buscarUsuarioPorId } from "../db/usuariosDB.js";

export function encriptarPassword(password){
    const salt = crypto.randomBytes(32).toString("hex");
    const hash = crypto.scryptSync(password, salt, 10, 64, "sha512").toString("hex");
    return{
        salt,
        hash
    }
}

export function validarPassword(password, salt, hash){
    const hashEvaluar = crypto.scryptSync(password, salt, 10, 64, "sha512").toString("hex");
    return hashEvaluar == hash
}

export function usuarioAutorizado(token, req) {
    if (!token) {
        return mensaje(400, "Usuario no Autorizado - token no proporcionado");
    }

    try {
        const usuario = jwt.verify(token, process.env.SECRET_TOKEN);
        req.usuario = usuario;
        return mensaje(200, usuario);  
    } catch (error) {
        return mensaje(400, "Usuario no Autorizado - token inválido");
    }
}

export async function adminAutorizado(req){
    const respuesta = usuarioAutorizado(req.cookies.token, req);
    if(respuesta.status != 200){
        return mensaje(400, "Administrador no Autorizado");
    }
    try {
        const usuario = await buscarUsuarioPorId(req.usuario.id);
        if (!usuario || usuario.tipoUsuario !== "admin") {
            return mensaje(400, "Admin no autorizado");
        }
        return mensaje(200, usuario); // aqui van los datos del admin pq solo mandaba un mesnaje
    } catch (error) {
        return mensaje(500, "Error al verificar administrador", error);
    }
}

