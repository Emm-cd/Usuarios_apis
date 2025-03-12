import User from "../models/usuarioModelo.js";
import { encriptarPassword, validarPassword } from "../middlewares/funcionesPassword.js";
import { mensaje } from "../libs/mensajes.js";
import {crearToken} from "../libs/jwt.js";

export const register = async ({username, email, password})=>{
    try {
        const usuarioExistente = await User.findOne({username});
        const emailExistente = await User.findOne({email});
        if (usuarioExistente || emailExistente){
            return(400,"Usuario Duplicado, ya existe");
        }
        const {salt, hash} = encriptarPassword(password);
        const data = new User({username, email, password: hash, salt});

        var respuesta = await data.save();
        const token = await crearToken(
            {
                id:respuesta._id,
                username:respuesta.username,
                email:respuesta.email,
                tipoUsuario:respuesta.tipoUsuario
            }
        );

        return mensaje(200,respuesta.tipoUsuario,"",token);
        //console.log("Usuario guardado correctamente");    
    } catch (error) {
        return mensaje(400,"Error al registrar al usuario",error);
        //console.log(error);          
    }
};

export const login = async ({username, password}) =>{
    try {
        const usuarioCorrecto = await User.findOne({username});
        console.log(usuarioCorrecto); 
        if(!usuarioCorrecto){
            return mensaje(400, "Datos Incorrectos de Usuario");
        }
        
        const passwordCorrecto = validarPassword(password, usuarioCorrecto.salt, usuarioCorrecto.password);
        if (!passwordCorrecto) {
            return mensaje (400, "Datos incorrectos de Password");
            
        }
        const token = await crearToken (
            {
                id:usuarioCorrecto._id, 
                username:usuarioCorrecto.username, 
                email:usuarioCorrecto.email, 
                tipoUsuario:usuarioCorrecto.tipoUsuario
            }
        );
        return mensaje(200, usuarioCorrecto.tipoUsuario,"",token);

    } catch (error) {
        return mensaje(400, "Datos Incorrectos", error);
    }
}

// 404 - No se ha encontrado

export const mostrarUsuarios = async () => {
    try {
        const usuarios = await User.find({});
        return usuarios;

    } catch (error) {
        return mensaje(404, "No hay usuarios registrados");
    }
    
}

export const buscarUsuarioPorId = async (id) => {
    try {
        const usuario = await User.findById(id);
        return usuario;

    } catch (error) {
        return mensaje(404, "No se encontro el usuario");
    }
}

export const actualizarUsuario = async (id, datos) => {
    try {
        const usuarioActualizado = await User.findByIdAndUpdate(id, datos, { new: true });
        return {
            mensaje: "Usuario actualizado correctamente",
            usuario: usuarioActualizado
        };

    } catch (error) {
        return mensaje(404, "No se actualizo el Usuario");
    }
}

export const borrarUsuario = async (id) => {
    try {
        const usuarioEliminado = await User.findByIdAndDelete(id);
        return mensaje(200, "Usuario eliminado correctamente");

    } catch (error) {
        return mensaje(404, "No se elimino el Usuario");
    }
}

export const isAdmin = async (id) => {
    try {
        const usuario = await User.findById(id);
        if(usuario.tipoUsuario != "admin"){
            return false;
        }
        return true;
    } catch (error) {
        return mensaje (400, "Admin no Autorizado", error);
    }
}