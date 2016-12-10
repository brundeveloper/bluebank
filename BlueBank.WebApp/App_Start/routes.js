//Importa Url
var url = require("url");

//Importa os dados estaticos
var data = require("../App_Data/bluebankDataNode.js");

//Função que obtem os parametros
var queryStringer = function(urlString){
	//Particiona a Url
	var urlParts = url.parse(urlString, true);

	//Retorna os paramentros
	return urlParts.query;
};

//Monta as Rotas
var routes = function(app){
	///////////////////////////////////////////////////////////////
	//Lista todas as contas
	app.get("/contas", function(req, res){
		//
		//data = mysql("SELECT * FROM tb_contas;");

		//Imprime na tela
		res.write(JSON.stringify(data));

		//Fecha conexão
		res.end();
	});

	///////////////////////////////////////////////////////////////
	//Obtem a conta pelo id
	app.get("/conta", function(req, res){
		//Variavel com o retorno
		var r = {};

		//Obtem os paramentros
		var query = queryStringer(req.url);
			
		//Se não tiver a agencia
		if (!query.id){
			//Retorna vazio
			res.write(JSON.stringify(r));

			//Fecha conexão
			res.end();

			//Sai da função
			return;
		}

		//
		//r = mysql("SELECT * FROM tb_contas WHERE id = '"+ query.id +"';");

		//Passa por cada conta
		data.forEach(function(conta){
			//Verifica se é a conta
			if (query.id == conta.id){
				//Adiciona na variável de retorno
				r = conta;

				//Para o foreach
				return;
			}
		});

		//Imprime na tela
		res.write(JSON.stringify(r));

		//Fecha conexão
		res.end();
	});

	///////////////////////////////////////////////////////////////
	//Obtem a conta pela agencia e numero
	app.get("/contaNumero", function(req, res){
		//Variavel com o retorno
		var r = {};

		//Obtem os paramentros
		var query = queryStringer(req.url);
			
		//Se não tiver a agencia
		if (!query.agencia){
			//Retorna vazio
			res.write(JSON.stringify(r));

			//Fecha conexão
			res.end();

			//Sai da função
			return;
		}

		//Se não tiver o numero
		if (!query.numero){
			//Retorna vazio
			res.write(JSON.stringify(r));

			//Fecha conexão
			res.end();

			//Sai da função
			return;
		}

		//
		//r = mysql("SELECT * FROM tb_contas WHERE agencia = '"+ query.agencia +"' AND numero = '"+ query.numero +"';");

		//Passa por cada conta
		data.forEach(function(conta){
			//Verifica se é a conta
			if ((query.agencia == conta.agencia) && (query.numero == conta.numero)){
				//Adiciona na variável de retorno
				r = conta;

				//Para o foreach
				return;
			}
		});

		//Imprime na tela
		res.write(JSON.stringify(r));

		//Fecha conexão
		res.end();
	});

	///////////////////////////////////////////////////////////////
};

//Exporta as rotas
module.exports = routes;