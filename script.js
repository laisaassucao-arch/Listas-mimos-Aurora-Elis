import { presentes } from "./presentes.js";
import { db } from "./firebase.js";

import {
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    salvarReserva,
    contarReservas,
    listarTodasReservas
} from "./reservas.js";

// ---------- ELEMENTOS ----------

const contador = document.getElementById("contador");
const pesquisa = document.getElementById("pesquisa");

const categorias = {
    higiene: document.getElementById("higiene"),
    acessorios: document.getElementById("acessorios"),
    roupinhas: document.getElementById("roupinhas"),
    calcados: document.getElementById("calcados"),
    quarto: document.getElementById("quarto"),
    amamentacao: document.getElementById("amamentacao"),
    passeio: document.getElementById("passeio")
};

let reservas = {};
// ---------- MODAL ----------

const modal = document.getElementById("modalReserva");

const nomeInput = document.getElementById("nomeConvidado");
const telefoneInput = document.getElementById("telefoneConvidado");
const mensagemInput = document.getElementById("mensagemConvidado");

const cancelarReserva = document.getElementById("cancelarReserva");
const confirmarReserva = document.getElementById("confirmarReserva");

let presenteSelecionado = null;

// ---------- CARD ----------

function criarCard(presente) {

    const card = document.createElement("div");
    card.className = "card";

    const quantidadeDesejada = presente.quantidadeDesejada || 1;

    const quantidadeReservada = reservas[presente.id] || 0;

    const reservado = quantidadeReservada >= quantidadeDesejada;

    let botaoShopee = "";

    if (presente.link) {
        botaoShopee = `
            <a
                href="${presente.link}"
                target="_blank"
                class="btn-link"
            >
                🛒 Ver produto
            </a>
        `;
    }

    card.innerHTML = `
        <div class="nome">${presente.nome}</div>

        <span class="status">
            ${
         quantidadeDesejada === 1
        ? (reservado ? "💖 Reservado" : "💕 Disponível")
        : `💕 ${quantidadeReservada} de ${quantidadeDesejada} reservados`
}
        </span>

        ${botaoShopee}

        <button
            class="btn-reservar"
            data-id="${presente.id}"
            ${reservado ? "disabled" : ""}
        >
            ${reservado ? "Reservado" : "Reservar"}
        </button>
    `;

    return card;
}

// ---------- RENDER ----------

function renderizarLista(texto = "") {

    Object.values(categorias).forEach(secao => {
        secao.innerHTML = "";
    });

    const filtro = texto.toLowerCase().trim();

    presentes.forEach(presente => {

        if (
            filtro &&
            !presente.nome.toLowerCase().includes(filtro)
        ) {
            return;
        }

        const secao = categorias[presente.categoria];

        if (!secao) return;

        secao.appendChild(criarCard(presente));

    });

    atualizarContador();

}
// ---------- CONTADOR ----------

function atualizarContador() {

    const total = presentes.length;

    const reservados = Object.values(reservas)
        .reduce((total, quantidade) => total + quantidade, 0);

    contador.textContent =
        `🎁 ${reservados} mimos reservados`;

}

// ---------- PESQUISA ----------

pesquisa.addEventListener("input", (e) => {

    renderizarLista(e.target.value);

});

// ---------- RESERVAR ----------

document.addEventListener("click", (e) => {

    console.log("Botão clicado!");

    if (!e.target.classList.contains("btn-reservar")) return;

    presenteSelecionado = e.target.dataset.id;

    nomeInput.value = "";
    telefoneInput.value = "";
    mensagemInput.value = "";

    modal.classList.remove("oculto");

    nomeInput.focus();

});

// ---------- CANCELAR ----------

cancelarReserva.addEventListener("click", () => {

    modal.classList.add("oculto");

});

// ---------- CONFIRMAR ----------

confirmarReserva.addEventListener("click", async () => {

    const nome = nomeInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const mensagem = mensagemInput.value.trim();

    if (!nome) {
        alert("Por favor, informe seu nome.");
        nomeInput.focus();
        return;
    }

    try {

        await salvarReserva({
            presenteId: presenteSelecionado,
            nome,
            telefone,
            mensagem
        });

        modal.classList.add("oculto");

        nomeInput.value = "";
        telefoneInput.value = "";
        mensagemInput.value = "";

        alert("💕 Reserva realizada com sucesso!");

        renderizarLista(pesquisa.value);

    } catch (erro) {

        console.error(erro);

        alert("Ocorreu um erro ao salvar a reserva.");

    }

});

// ---------- FIREBASE ----------

onSnapshot(collection(db, "reservas"), (snapshot) => {

    reservas = {};

    snapshot.forEach((docItem) => {

        const dados = docItem.data();

        if (!reservas[dados.presenteId]) {
            reservas[dados.presenteId] = 0;
        }

        reservas[dados.presenteId]++;

    });

    renderizarLista(pesquisa.value);

});

// ---------- PRIMEIRA RENDERIZAÇÃO ----------

renderizarLista();

// ==============================
// ÁREA DA MAMÃE
// ==============================

const painelMamae = document.getElementById("painelMamae");
const abrirMamae = document.getElementById("abrirMamae");
const fecharPainel = document.getElementById("fecharPainel");

const modalLogin = document.getElementById("modalLoginMamae");
const senhaMamae = document.getElementById("senhaMamae");

const entrarMamae = document.getElementById("entrarMamae");
const cancelarLogin = document.getElementById("cancelarLogin");

const listaReservas = document.getElementById("listaReservas");
const totalReservas = document.getElementById("totalReservas");
const totalPresentes = document.getElementById("totalPresentes");

const SENHA_MAMAE = "Aurora2026";

// Abre o modal de login
abrirMamae.addEventListener("click", () => {

    senhaMamae.value = "";

    modalLogin.classList.remove("oculto");

    senhaMamae.focus();

});

// Fecha o modal de login
cancelarLogin.addEventListener("click", () => {

    modalLogin.classList.add("oculto");

});

// Verifica a senha
entrarMamae.addEventListener("click", () => {

    if (senhaMamae.value !== SENHA_MAMAE) {

        alert("Senha incorreta!");

        senhaMamae.focus();

        return;

    }

modalLogin.classList.add("oculto");

carregarAreaMamae();

painelMamae.classList.remove("oculto");
});
async function carregarAreaMamae() {

    const reservas = await listarTodasReservas();
    console.log(reservas);

    listaReservas.innerHTML = "";

    totalReservas.textContent = reservas.length;

    totalPresentes.textContent =
        new Set(reservas.map(r => r.presenteId)).size;

    reservas.forEach(reserva => {

        const presente = presentes.find(
            p => p.id === reserva.presenteId
        );

        listaReservas.innerHTML += `

        <div class="reserva-card">

            <h3>🎁 ${presente ? presente.nome : reserva.presenteId}</h3>

            <p><strong>👤</strong> ${reserva.nome}</p>

            <p><strong>📱</strong> ${reserva.telefone || "-"}</p>

            <p><strong>💌</strong> ${reserva.mensagem || "-"}</p>

        </div>

        `;

    });

}
// Fecha o painel
fecharPainel.addEventListener("click", () => {

    painelMamae.classList.add("oculto");

});