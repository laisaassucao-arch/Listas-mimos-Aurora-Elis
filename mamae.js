import { presentes } from "./presentes.js";
import {
    listarTodasReservas,
    cancelarReserva
} from "./reservas.js";

const lista = document.getElementById("listaReservas");
const totalReservas = document.getElementById("totalReservas");
const totalPresentes = document.getElementById("totalPresentes");
const pesquisa = document.getElementById("pesquisar");

let todasReservas = [];

function nomePresente(id){

    const presente = presentes.find(p => p.id === id);

    return presente ? presente.nome : id;

}

function renderizar(filtro=""){

    lista.innerHTML="";

    const reservasFiltradas = todasReservas.filter(reserva=>{

        const nome = reserva.nome.toLowerCase();
        const presente = nomePresente(reserva.presenteId).toLowerCase();

        return nome.includes(filtro.toLowerCase())
            || presente.includes(filtro.toLowerCase());

    });

    totalReservas.textContent = reservasFiltradas.length;

    totalPresentes.textContent =
        new Set(reservasFiltradas.map(r=>r.presenteId)).size;

    reservasFiltradas.forEach(reserva=>{

        lista.innerHTML += `
            <div class="reserva-card">

                <h3>🎁 ${nomePresente(reserva.presenteId)}</h3>

                <p><strong>👤</strong> ${reserva.nome}</p>

                <p><strong>📱</strong> ${reserva.telefone || "-"}</p>

                <p><strong>💌</strong> ${reserva.mensagem || "-"}</p>

<button
    class="btn-cancelar"
    data-id="${reserva.id}"
>
    ❌ Cancelar Reserva
</button>

            </div>
        `;

    });

}

async function carregar(){

    todasReservas = await listarTodasReservas();

    renderizar();

}

pesquisa.addEventListener("input",(e)=>{

    renderizar(e.target.value);

});

carregar();

document.addEventListener("click", async(e)=>{

    if(!e.target.classList.contains("btn-cancelar")) return;

    const confirmar = confirm(
        "Deseja realmente cancelar esta reserva?"
    );

    if(!confirmar) return;

    await cancelarReserva(
        e.target.dataset.id
    );

    carregar();

});