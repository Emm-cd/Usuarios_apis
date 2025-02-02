import {Router} from "express";
import { register, login, mostrarUsuarios, buscarPorId, actualizarUsuario, borrarUsuario } from "../db/usuariosDB.js";
const router = Router();

router.get("/", async (req, res) => {
    const usuarios = await mostrarUsuarios(req.body);
    console.log(usuarios);
    res.send(usuarios);
});

router.get("/buscarPorId/:id", async (req,res) => {
    const usuario = await buscarPorId(req.params.id);
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
    const respuesta = await register(req.body);
    console.log(respuesta);
    res.cookie("token",respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);
});

router.post("/login", async(req,res)=>{
    const respuesta = await login (req.body);
    console.log(respuesta.mensajeOriginal);
    res.cookie("token", respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);  
});

router.get("/salir", async(req,res)=>{
    res.json("Estas en salir");
});

router.get("/usuariosLogueados", async(req,res)=>{
    res.json("Usuarios convencionales y administradores logueados");
});

router.get("/administradores", async(req,res)=>{
    res.json("Solo administradores logueados");
});

router.get("/cualquierUsuario", async(req,res)=>{
    res.json("Todos pueden entrar sin loguearse");
});


export default router;