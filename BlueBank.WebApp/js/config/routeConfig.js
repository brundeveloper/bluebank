//Configuração das Rotas
angular.module("blueBank").config(function($routeProvider){
	//Tela de login
	$routeProvider.when("/access", {
		templateUrl: "view/access.html",
		controller: "accountCtrl"
	});

	//Tela do cliente
	$routeProvider.when("/client", {
		templateUrl: "view/client.html",
		controller: "accountCtrl"
	});

	//Tela de transferência
	$routeProvider.when("/transfer", {
		templateUrl: "view/transfer.html",
		controller: "accountCtrl"
	});

	//Tela de transferência
	$routeProvider.when("/transferSuccess", {
		templateUrl: "view/transferSuccess.html",
		controller: "accountCtrl"
	});

	//Tela padrão
	$routeProvider.otherwise({
		redirectTo: "/access"
	});
});