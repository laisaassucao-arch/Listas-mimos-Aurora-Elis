import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Salva uma nova reserva

export async function salvarReserva(dados){

    await addDoc(
        collection(db,"reservas"),
        {
            ...dados,
            dataReserva: serverTimestamp()
        }
    );

}

// Conta quantas reservas um presente possui

export async function contarReservas(presenteId){

    const consulta = query(
        collection(db,"reservas"),
        where("presenteId","==",presenteId)
    );

    const resultado = await getDocs(consulta);

    return resultado.size;

}