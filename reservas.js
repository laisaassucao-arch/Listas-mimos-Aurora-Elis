import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

/**
 * Salva uma nova reserva
 */
export async function salvarReserva({
    presenteId,
    nome,
    telefone,
    mensagem
}) {

    await addDoc(
        collection(db, "reservas"),
        {
            presenteId,
            nome,
            telefone,
            mensagem,
            status: "reservado",
            dataReserva: serverTimestamp()
        }
    );

}

/**
 * Conta quantas reservas existem para um presente
 */
export async function contarReservas(presenteId) {

    const consulta = query(
        collection(db, "reservas"),
        where("presenteId", "==", presenteId)
    );

    const resultado = await getDocs(consulta);

    return resultado.size;

}

/**
 * Lista todas as reservas de um presente
 * (será usado na Área da Mamãe)
 */
export async function listarReservas(presenteId) {

    const consulta = query(
        collection(db, "reservas"),
        where("presenteId", "==", presenteId)
    );

    const resultado = await getDocs(consulta);

    return resultado.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

}