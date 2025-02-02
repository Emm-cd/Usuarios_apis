import User from "../models/usuarioModelo.js";
import { encriptarPassword, validarPassword } from "../middlewares/funcionesPassword.js";
import { mensaje } from "../libs/mensajes.js";
import {crearToken} from "../libs/jwt.js";

export const register = async ({username, email, password})=>{
    try {
        const usuarioDuplicado = await User.findOne({username});
        const emailDuplicado = await User.findOne({email});
        if (usuarioDuplicado || emailDuplicado){
            return(400,"Usuario Duplicado, ya existe");
        }
        const {salt, hash} = encriptarPassword(password);
        const dataUser = new User({username, email, password: hash, salt});

        const respuestaMongo = await dataUser.save();
        const token = await crearToken({id:respuestaMongo._id});

        return mensaje(200,"Usuario Registrado","",token);
        //console.log("Usuario guardado correctamente");
        
    } catch (error) {
        return mensaje(400,"Error al registrar al usuario",error);
        //console.log(error);
                
    }
};

export const login = async ({username, password}) =>{
    try {
        const usuarioEncontrado = await User.findOne({username});
        if(!usuarioEncontrado){
            return mensaje(400, "1Datos Incorrectos", error);
        }
        
        const passwordValido = validarPassword(password, usuarioEncontrado.salt, usuarioEncontrado.password);
        if (!passwordValido) {
            return mensaje (400, "2Datos incorrectos", error);
            
        }
        const token = await crearToken ({id:usuarioEncontrado._id});
        return mensaje(200, `Bienvenido ${usuarioEncontrado.username}`, "", token);

    } catch (error) {
        return mensaje(400, "3Datos Incorrectos", error);
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

export const buscarPorId = async (id) => {
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


