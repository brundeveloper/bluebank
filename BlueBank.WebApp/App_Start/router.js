//Importa o http
var http = require("http");

//Função que cria o roteador
var router = function(port){
	//Variavel base para guardar as funções de roteamento dinsponiveis
	var api = {};

	//Rotas
	var routes = {};

	//Metodos permitidos para roteamento
	var methods = ["GET", "POST", "OPTIONS"];

	var interceptors = [];

	//Passa por cada método
	methods.forEach(function(method){
		//Cria um objeto de rotas com o método em questao
		routes[method] = {};

		//Cria a função de roteamento com o método em questão
		api[method.toLowerCase()] = function(path, fn){
			//Cria a função de callback que será chamada a partir da rota para o método chamado
			routes[method][path] = fn;
		};
	});

	//Função de mapeamento de escrita
	var handleBody = function(req, res, next){
		//Array que guardará os dados
		var body = [];

		//Evento de dados
		req.on("data", function(chunk){
			//Empilha dado
			body.push(chunk);
		});

		//Evento de feachamento de conexão
		req.on("end", function(){
			//Coloca os dados no body
			req.body = Buffer.concat(body).toString();

			//Chama função de callback
			next();
		});
	};

	//Função que ajusta a Url
	var handleUrl = function(url){
		//Obtem o conjunto da url e parametros
		var r = url.split("?");

		//Retorna a Url
		return r[0];
	};

	//Cria servidor
	http.createServer(function(req, res){
		//Mapeamento de escrita
		handleBody(req, res, function(){
			//Permissão de controle para liberar em caso de conflito de politica de mesma origem
			res.setHeader("Access-Control-Allow-Origin", "*");

			//Permissão de controle no Header
			res.setHeader("Access-Control-Allow-Headers", "Content-Type");

			//Obtem a Url
			var url = handleUrl(req.url);

			//Se a rota não for encontrada
			if (!routes[req.method][url]){
				//Retorna codigo de pagina nao encontrada
				res.statusCode = 404;

				//Fecha conexão
				return res.end();
			}

			//Chama rota
			routes[req.method][url](req, res);
		});
	}).listen(port);

	//Retorna as funções de roteamento dinsponiveis
	return api;
};

//Exporta o roteador
module.exports = router;