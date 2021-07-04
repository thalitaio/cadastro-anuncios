class Anuncio {
  /**
   * @constructor
   * @param {string} nomeAnuncio Nome do anúncio cadastrado.
   * @param {string} dataInicio Data do início da veiculação do anúncio.
   * @param {string} dataTermino Data do término da veiculação do anúncio.
   * @param {number} valorInvestido Valor investido por dia no anúncio.
   * @param {string} cliente Nome do cliente.
   */
  constructor(nomeAnuncio, dataInicio, dataTermino, valorInvestido, cliente) {
    this.nomeAnuncio = nomeAnuncio;
    this.dataInicio = dataInicio;
    this.dataTermino = dataTermino;
    this.valorInvestido = valorInvestido;
    this.cliente = cliente;
  }

  /**
   * Converte o input do nome do cliente para uppercase
   * @returns false caso o valor seja undefined, "" ou null
   * @returns true caso o valor seja validado com sucesso
   */
  validarDados() {
    this.cliente = this.cliente.toUpperCase();
    for (let i in this) {
      if (this[i] == undefined || this[i] == "" || this[i] == null) {
        return false;
      }
    }
    return true;
  }
}
/**
 * Classe para o banco de dados na localStorage
 * Verifica se o id da localStorage é null e o seta para 0
 */
class Bd {
  constructor() {
    let id = localStorage.getItem("id");

    if (id === null) {
      localStorage.setItem("id", 0);
    }
  }
  /**
   * Verifica o id atual e o incrementa
   * @returns id seguinte a ser gravado
   */
  getProximoId() {
    let proximoId = localStorage.getItem("id");
    return parseInt(proximoId) + 1;
  }
  /**
   * Grava o anúncio, selecionando o id correto.
   * @param {*} d
   */
  gravar(d) {
    let id = this.getProximoId();
    localStorage.setItem(id, JSON.stringify(d));
    localStorage.setItem("id", id);
  }
  /**
   * Recupera todos os anuncios cadastradas em localStorage.
   * Verifica se itens foram removidos (null) e os pula para continuar.
   * @returns Array anuncios com os anúncios recuperados.
   */
  recuperarTodosRegistros() {
    let anuncios = [];

    let id = localStorage.getItem("id");

    for (let i = 1; i <= id; i++) {
      let anuncio = JSON.parse(localStorage.getItem(i));
      if (anuncio === null) {
        continue;
      }
      anuncio.id = i;
      anuncios.push(anuncio);
    }

    return anuncios;
  }

  /**
   * Recupera os anúncios por cliente, data de início e de término.
   * @param {*} anuncio instância da classe Anúncio.
   * @returns array com anúncios filtrados.
   */
  pesquisar(anuncio) {
    let anunciosFiltrados = [];
    anunciosFiltrados = this.recuperarTodosRegistros();

    if (anuncio.cliente != "") {
      anunciosFiltrados = anunciosFiltrados.filter(
        (d) => d.cliente == anuncio.cliente
      );
    }

    if (anuncio.dataInicio != "") {
      anunciosFiltrados = anunciosFiltrados.filter(
        (d) => d.dataInicio == anuncio.dataInicio
      );
    }

    if (anuncio.dataTermino != "") {
      anunciosFiltrados = anunciosFiltrados.filter(
        (d) => d.dataTermino == anuncio.dataTermino
      );
    }

    return anunciosFiltrados;
  }
  /**
   * Remove os anúncios a partir de seus ids.
   * @param {number} id do objeto salvo na localStorage.
   */
  remover(id) {
    localStorage.removeItem(id);
  }
}
/**
 * @type {Object}
 */
let bd = new Bd();

/**
 * Cadastra a nova instância do Anúncio na localStorage, verificando se todos os campos foram preenchidos corretamente.
 *
 */
function cadastrarAnuncio() {
  let nomeAnuncio = document.getElementById("nomeAnuncio");
  let dataInicio = document.getElementById("dataInicio");
  let dataTermino = document.getElementById("dataTermino");
  let valorInvestido = document.getElementById("valorInvestido");
  let cliente = document.getElementById("cliente");

  let anuncio = new Anuncio(
    nomeAnuncio.value,
    dataInicio.value,
    dataTermino.value,
    valorInvestido.value,
    cliente.value
  );

  if (anuncio.validarDados()) {
    bd.gravar(anuncio);
    criarModalSucesso();
    limpaCampos();
  } else {
    criarModalErro();
  }
}

/**
 * Cria o modal de cadastro realizado com sucesso.
 */
function criarModalSucesso() {
  document.getElementById("titulo").innerHTML = "Anúncio inserido com sucesso";
  document.getElementById("titulo-div").className = "modal-header text-success";
  document.getElementById("texto").innerHTML =
    "Anúncio foi cadastrado com sucesso!";
  document.getElementById("botao").innerHTML = "Voltar";

  document.getElementById("botao").className = "btn btn-success";

  $("#modalRegistroAnuncio").modal("show");
}

/**
 * Cria o modal de erro no cadastro.
 */
function criarModalErro() {
  document.getElementById("titulo").innerHTML = "Erro no cadastro";
  document.getElementById("titulo-div").className = "modal-header text-danger";
  document.getElementById("texto").innerHTML =
    "Existem campos obrigatórios que não foram preenchidos.";
  document.getElementById("botao").innerHTML = "Corrigir";
  document.getElementById("botao").className = "btn btn-danger";

  $("#modalRegistroAnuncio").modal("show");
}

/**
 * Limpa os campos do cadastro.
 */
function limpaCampos() {
  nomeAnuncio.value = "";
  dataInicio.value = "";
  dataTermino.value = "";
  valorInvestido.value = "";
  cliente.value = "";
}

/**
 * Carrega lista de Anúncios para visualização, criando uma tabela com botão para excluir o anúncio da lista.
 * @param {*} anuncios array com os anúncios a serem exibidos.
 * @param {boolean} filtro
 */
function carregaListaAnuncios(anuncios = [], filtro = false) {
  if (anuncios.length == 0 && filtro == false) {
    anuncios = bd.recuperarTodosRegistros();
  }

  let listaAnuncios = document.getElementById("listaAnuncios");
  listaAnuncios.innerHTML = "";

  anuncios.forEach(function (d) {
    let linha = listaAnuncios.insertRow();

    let data1 = new Date(d.dataInicio.toString());
    let data2 = new Date(d.dataTermino.toString());
    let periodo = (data2 - data1) / 86400000;
    let diasTotais = periodo;

    d.totalInvestido = Math.ceil(diasTotais * d.valorInvestido);
    d.maxViews = d.totalInvestido * 50;
    d.maxClicks = Math.ceil(d.totalInvestido * 3.6);
    d.maxShare = Math.ceil(d.totalInvestido * 0.5);

    linha.insertCell(0).innerHTML = d.cliente;
    linha.insertCell(1).innerHTML = `R$ ${d.totalInvestido},00`;
    linha.insertCell(2).innerHTML = d.maxViews;
    linha.insertCell(3).innerHTML = d.maxClicks;
    linha.insertCell(4).innerHTML = d.maxShare;

    let btn = document.createElement("button");
    btn.className = "btn btn-danger btn-sm";
    btn.innerHTML = '<i class="fas fa-times"></i>';
    btn.id = `id_anuncio_${d.id}`;
    btn.onclick = function () {
      let id = this.id.replace("id_anuncio_", "");
      bd.remover(id);

      window.location.reload();
    };
    linha.insertCell(5).append(btn);
  });
}

/**
 * Pesquisa os anúncios e retorna a tabela apenas com os anúncios que correspondem aos parâmetros de pesquisa.
 */
function pesquisarAnuncio() {
  let dataInicio = document.getElementById("dataInicio").value;
  let dataTermino = document.getElementById("dataTermino").value;
  let cliente = document.getElementById("cliente").value.toUpperCase();

  let anuncio = new Anuncio(
    nomeAnuncio,
    dataInicio,
    dataTermino,
    valorInvestido,
    cliente
  );

  let anuncios = bd.pesquisar(anuncio);

  carregaListaAnuncios(anuncios, true);

  limpaCampos();
}
