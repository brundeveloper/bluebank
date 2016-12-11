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
			
		//Se não tiver a conta
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
	//Faz a transferencia
	app.post("/transferir", function(req, res){
		//Obtem os dados
		var params = req.body;

		//Converte os dados para JSON
		params = JSON.parse(params);

		//Variaveis de com as contas
		var contaDebitar = {};
		var contaCreditar = {};
		var valor = 0;

		//Variavel com o retorno
		var r = {};

		//Se não tiver a conta a ser debitada
		if (!params.dataD.id){
			//Mensagem para o usuario
			var r = {
				success: false,
				msg: "Não foi enviado a conta a ser debitada"
			};

			//Retorna vazio
			res.write(JSON.stringify(r));

			//Fecha conexão
			res.end();

			//Sai da função
			return;
		}

		//Se não tiver a conta a ser creditada
		if (!params.dataC.id){
			//Mensagem para o usuario
			var r = {
				success: false,
				msg: "Não foi enviado a conta a ser creditada"
			};

			//Retorna vazio
			res.write(JSON.stringify(r));

			//Fecha conexão
			res.end();

			//Sai da função
			return;
		}

		//Se não tiver o valor
		if (!params.v){
			//Mensagem para o usuario
			var r = {
				success: false,
				msg: "O valor da transferencia está incorreto"
			};

			//Retorna vazio
			res.write(JSON.stringify(r));

			//Fecha conexão
			res.end();

			//Sai da função
			return;
		}

		//Verifica se a conta debitada existe
		//
		//contaDebitar = mysql("SELECT * FROM tb_contas WHERE id = '"+ params.dataD.id +"';");

		//Passa por cada conta
		data.forEach(function(conta){
			//Verifica se é a conta
			if (params.dataD.id == conta.id){
				//Adiciona na variável de retorno
				contaDebitar = conta;
			}
		});

		//Se não tiver a conta a ser creditada
		if (!contaDebitar.id){
			//Mensagem para o usuario
			var r = {
				success: false,
				msg: "A conta a ser debitada não foi encontrada"
			};

			//Retorna vazio
			res.write(JSON.stringify(r));

			//Fecha conexão
			res.end();

			//Sai da função
			return;
		}

		//Verifica se a conta creditada existe
		//
		//contaCreditar = mysql("SELECT * FROM tb_contas WHERE id = '"+ params.dataC.id +"';");

		//Passa por cada conta
		data.forEach(function(conta){
			//Verifica se é a conta
			if (params.dataC.id == conta.id){
				//Adiciona na variável de retorno
				contaCreditar = conta;
			}
		});

		//Se não tiver a conta a ser creditada
		if (!contaCreditar.id){
			//Mensagem para o usuario
			var r = {
				success: false,
				msg: "A conta a ser creditada não foi encontrada"
			};

			//Retorna vazio
			res.write(JSON.stringify(r));

			//Fecha conexão
			res.end();

			//Sai da função
			return;
		}

		//Obtem o valor
		valor = Number(params.v);

		//Verifica se o valor é maior que 0
		if (valor <= 0){
			//Mensagem para o usuario
			var r = {
				success: false,
				msg: "O valor da transferencia está incorreto"
			};

			//Retorna vazio
			res.write(JSON.stringify(r));

			//Fecha conexão
			res.end();

			//Sai da função
			return;
		}

		//Verifica se tem saldo
		if (contaDebitar.saldo < valor){
			//Mensagem para o usuario
			var r = {
				success: false,
				msg: "O valor da transferencia está acima do saldo da conta"
			};

			//Retorna vazio
			res.write(JSON.stringify(r));

			//Fecha conexão
			res.end();

			//Sai da função
			return;
		}

		//Faz a transferencia
		//
		//r = mysql("UPDATE tb_contas SET saldo = "+ (contaDebitar.saldo - valor) +" WHERE id = '"+ contaDebitar.id +"';");
		//
		//r = mysql("UPDATE tb_contas SET saldo = "+ (contaCreditar.saldo + valor) +" WHERE id = '"+ contaCreditar.id +"';");

		//Mensagem para o usuario
		var r = {
			success: true,
			msg: "Transferência realizada com sucesso."
		};

		//Retorna
		res.write(JSON.stringify(r));

		//Fecha conexão
		res.end();
	});

	app.options("/transferir", function(req, res){
		//Fecha conexão
		res.end();
	});

	///////////////////////////////////////////////////////////////
};

//Exporta as rotas
module.exports = routes;