import { Direccion } from "../direccion/direccion";

export class Usuario {
    id?: string;          
    email: string;        
    estado: boolean;        
    nombre: string = "";       
    apellido?: string = "";   
    dni?: number;         
    fechaNacimiento: string = "";
    direccion?: Direccion;

    constructor(email: string,uid:string) {
        this.email = email;
        this.id = uid;
        this.estado = false; 
    }
}

