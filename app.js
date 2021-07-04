class Anuncio {
  constructor(nomeAnuncio, dataInicio, dataTermino, valorInvestido, cliente) {
    this.nomeAnuncio = nomeAnuncio;
    this.dataInicio = dataInicio;
    this.dataTermino = dataTermino;
    this.valorInvestido = valorInvestido;
    this.cliente = cliente;
  }

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

class Bd {
  constructor() {
    let id = localStorage.getItem("id");

    if (id === null) {
      localStorage.setItem("id", 0);
    }
  }

  getProximoId() {
    let proximoId = localStorage.getItem("id");
    return parseInt(proximoId) + 1;
  }

  gravar(d) {
    let id = this.getProximoId();
    localStorage.setItem(id, JSON.stringify(d));
    localStorage.setItem("id", id);
  }

  recuperarTodosRegistros() {
    let anuncios = [];

    let id = localStorage.getItem("id");

    //recuperar todos os anuncios cadastradas em localStorage
    for (let i = 1; i <= id; i++) {
      //recuperar anuncio
      let anuncio = JSON.parse(localStorage.getItem(i));

      // pode haver itens pulados/removidos
      // nesse casos nós valos pular esses itens
      if (anuncio === null) {
        continue;
      }

      anuncio.id = i;
      anuncios.push(anuncio);
    }
    return anuncios;
  }

  pesquisar(anuncio) {
    let anunciosFiltrados = [];
    anunciosFiltrados = this.recuperarTodosRegistros();

    // recuperar cliente
    if (anuncio.cliente != "") {
      anunciosFiltrados = anunciosFiltrados.filter(
        (d) => d.cliente == anuncio.cliente
      );
    }

    // recuperar dataInicio
    if (anuncio.dataInicio != "") {
      anunciosFiltrados = anunciosFiltrados.filter(
        (d) => d.dataInicio == anuncio.dataInicio
      );
    }
    // recuperar dataTermino
    if (anuncio.dataTermino != "") {
      anunciosFiltrados = anunciosFiltrados.filter(
        (d) => d.dataTermino == anuncio.dataTermino
      );
    }

    return anunciosFiltrados;
  }

  remover(id) {
    localStorage.removeItem(id);
  }
}

let bd = new Bd();

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

    //personaliza modal
    document.getElementById("titulo").innerHTML =
      "Anúncio inserido com sucesso";
    document.getElementById("titulo-div").className =
      "modal-header text-success";
    document.getElementById("texto").innerHTML =
      "Anúncio foi cadastrado com sucesso!";
    document.getElementById("botao").innerHTML = "Voltar";

    document.getElementById("botao").className = "btn btn-success";

    //limpar campos
    nomeAnuncio.value = "";
    dataInicio.value = "";
    dataTermino.value = "";
    valorInvestido.value = "";
    cliente.value = "";

    //dialog de sucesso
    $("#modalRegistroAnuncio").modal("show");
  } else {
    //personaliza modal
    document.getElementById("titulo").innerHTML = "Erro no cadastro";
    document.getElementById("titulo-div").className =
      "modal-header text-danger";
    document.getElementById("texto").innerHTML =
      "Existem campos obrigatórios que não foram preenchidos.";
    document.getElementById("botao").innerHTML = "Corrigir";
    document.getElementById("botao").className = "btn btn-danger";

    //dialog de erro
    $("#modalRegistroAnuncio").modal("show");
  }
}

function carregaListaAnuncios(anuncios = [], filtro = false) {
  if (anuncios.length == 0 && filtro == false) {
    anuncios = bd.recuperarTodosRegistros();
  }

  //selecionando tbody da tabela
  let listaAnuncios = document.getElementById("listaAnuncios");
  listaAnuncios.innerHTML = "";

  //percorre array anuncios listando cada anuncio de forma dinâmica
  anuncios.forEach(function (d) {
    //criando a linha (tr)
    let linha = listaAnuncios.insertRow();

    let data1 = new Date(d.dataInicio.toString());
    let data2 = new Date(d.dataTermino.toString());
    let periodo = (data2 - data1) / 86400000;
    let diasTotais = periodo;

    d.totalInvestido = Math.ceil(diasTotais * d.valorInvestido);
    d.maxViews = d.totalInvestido * 50;
    d.maxClicks = Math.ceil(d.totalInvestido * 3.6);
    d.maxShare = Math.ceil(d.totalInvestido * 0.5);

    //criar as colunas (td) e atribuir seus conteúdos
    linha.insertCell(0).innerHTML = d.totalInvestido;
    linha.insertCell(1).innerHTML = d.maxViews;
    linha.insertCell(2).innerHTML = d.maxClicks;
    linha.insertCell(3).innerHTML = d.maxShare;

    //criar o botão de exclusão
    let btn = document.createElement("button");
    btn.className = "btn btn-danger btn-sm";
    btn.innerHTML = '<i class="fas fa-times"></i>';
    btn.id = `id_anuncio_${d.id}`;
    btn.onclick = function () {
      //arrumar a string antes de remover
      let id = this.id.replace("id_anuncio_", "");
      //remover a anuncio
      bd.remover(id);

      window.location.reload();
    };
    linha.insertCell(4).append(btn);
  });
}

function pesquisarAnuncio() {
  let nomeAnuncio = document.getElementById("nomeAnuncio").value;
  let dataInicio = document.getElementById("dataInicio").value;
  let dataTermino = document.getElementById("dataTermino").value;
  let valorInvestido = document.getElementById("valorInvestido").value;
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
}
