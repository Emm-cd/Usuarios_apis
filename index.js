import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import usuariosRutas from "./routes/usuariosRutas.js";
import {conectarDB} from "./db/db.js";

const app = express();
conexionBD();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:3001", 
    credentials: true
}));

async function conexionBD() {
    const mensajeDB = await conectarDB();
    console.log(mensajeDB);
}

app.use("/api", usuariosRutas);
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Servidor en http://localhost:${PORT}`);
    
})