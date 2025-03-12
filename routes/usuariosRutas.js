import {Router} from "express";
import { register, login, mostrarUsuarios, buscarUsuarioPorId, actualizarUsuario, borrarUsuario } from "../db/usuariosDB.js";
import { usuarioAutorizado, adminAutorizado } from "../middlewares/funcionesPassword.js";
const router = Router();
import User from "../models/usuarioModelo.js";

router.get("/", async (req, res) => {
    const usuarios = await mostrarUsuarios(req.body);
    console.log(usuarios);
    res.send(usuarios);
});

router.get("/buscarUsuarioPorId/:id", async (req,res) => {
    const usuario = await buscarUsuarioPorId(req.params.id);
    console.log(usuario);
    res.send(usuario);
    
});

router.patch("/actualizarUsuario/:id", async (req,res) => {
    const usuarioActualizado = await actualizarUsuario(req.params.id, req.body);
    console.log(usuarioActualizado);
    res.send(usuarioActualizado);
    
});

router.delete("/borrarUsuario/:id", async (req,res) => {
    const usuarioEliminado = await borrarUsuario(req.params.id);
    console.log(usuarioEliminado);
    res.send(usuarioEliminado);
});

router.post("/registro", async(req,res)=>{
    console.log(req.body);
    const respuesta = await register(req.body);
    console.log(respuesta);
    res.cookie('token',respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);
});

router.post("/login", async(req,res)=>{
    const respuesta = await login(req.body.usuario);
    res.cookie('token',respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);
});

router.get("/salir", async(req,res)=>{
    res.cookie('token','',{expires:new Date(0)}).clearCookie('token').status(200).json("Sesión cerrada correctamente");
});

router.get("/usuariosLogueados", async (req, res) => {
    const respuesta = usuarioAutorizado(req.cookies.token, req);

    if (respuesta.status !== 200) {
        return res.status(respuesta.status).json(respuesta.mensajeUsuario);
    }

    try {
        const usuario = await User.findById(respuesta.mensajeUsuario.id).select('username email tipoUsuario');
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al buscar el usuario", error });
    }
});

router.get("/administradores", async(req,res)=>{ // los objetos que estas registrados como administradores
    const respuesta = await adminAutorizado(req);

    if (respuesta.status !== 200) {
        return res.status(respuesta.status).json(respuesta.mensajeUsuario);
    }

    return res.status(200).json(respuesta.mensajeUsuario);
});

router.get("/cualquierUsuario/:id", async (req, res) => {
    try {
        const admin = await adminAutorizado(req);
        
        if (admin.status !== 200) {
            return res.status(400).json({ mensaje: "No autorizado" });
        }

        const usuario = await buscarUsuarioPorId(req.params.id);

        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.status(200).json(usuario); // Enviar los datos del usuario correctamente
    } catch (error) {
        console.error("Error al obtener usuario por ID:", error);
        res.status(500).json({ mensaje: "Error interno al obtener el usuario", error: error.message });
    }
});


router.get("/todosUsuarios", async (req, res) => { 
    const admin = await adminAutorizado(req);
    
    if (admin.status !== 200) {
        return res.status(400).json({ mensaje: "No autorizado" });
    }

    try {
        const usuarios = await mostrarUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener usuarios", error });
    }
});

router.put("/editarUsuario/:id", async (req, res) => {
    try {
        const admin = await adminAutorizado(req);
        if (admin.status !== 200) {
            return res.status(403).json({ mensaje: "No autorizado" });
        }

        // Extraer los datos a actualizar
        const { username, email, tipoUsuario } = req.body;

        // Buscar y actualizar el usuario
        const usuarioActualizado = await actualizarUsuario(req.params.id, { username, email, tipoUsuario });

        if (!usuarioActualizado) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.status(200).json({ mensaje: "Usuario actualizado", usuario: usuarioActualizado });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ mensaje: "Error interno al actualizar usuario", error: error.message });
    }
});

router.delete("/borrarUsuario/:id", async (req, res) => {
    try {
 
        const admin = await adminAutorizado(req);
        if (admin.status !== 200) {
            return res.status(403).json({ mensaje: "No autorizado" });
        }

        const usuarioEliminado = await eliminarUsuario(req.params.id);

        if (!usuarioEliminado) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ mensaje: "Error interno al eliminar usuario", error: error.message });
    }
});

export default router;


