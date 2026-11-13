import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./db.js";

const passwordHash = await bcrypt.hash("sigma123", 10);
await db.query("INSERT INTO users (full_name,email,password_hash,role) VALUES (?,?,?,?),(?,?,?,?) ON DUPLICATE KEY UPDATE full_name=VALUES(full_name),password_hash=VALUES(password_hash),role=VALUES(role)", ["Ana Supervisora", "supervisor@sigma.local", passwordHash, "SUPERVISOR", "Tomás Técnico", "tecnico@sigma.local", passwordHash, "TECHNICIAN"]);
console.log("Usuarios de prueba creados. Contraseña: sigma123");
await db.end();
