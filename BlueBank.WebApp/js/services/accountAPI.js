//Serviço accountAPI
angular.module("blueBank").service("accountAPI", function($http){
	//Obtem a conta pelo id
	this.getAccount = function(id){
		//Retorna a requisição
		return $http.get("http://localhost:3412/conta?id="+id);
	};

	//Obtem a conta pelo numero
	this.getAccountByNumber = function(agency, number){
		//Retorna a requisição
		return $http.get("http://localhost:3412/contaNumero?agencia="+ agency +"&numero="+number);
	};

	//Faz a transferencia
	this.transfer = function(data){
		//Faz a requisição
		return $http.post('http://localhost:3412/transferir', data);
	}

});