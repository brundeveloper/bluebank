//Controller accountCtrl
angular.module("blueBank").controller("accountCtrl", function($scope, $location, $sessionStorage, accountAPI){
	//Dados do cliente logado
	$scope.client = $sessionStorage.account;

	//Dados do cliente para transferencia
	$scope.transferData = $sessionStorage.transfer;

	//Mensagem na tela
	$scope.message = "";

	//Acessar a conta
	$scope.access = function(account){
		//Faz requisição
		accountAPI.getAccountByNumber(account.agency, account.number)
		.success(function(data, status){
			//Verifica se retornou vazio
			if (!('id' in data)){

				//Mostra mensagem de erro
				$scope.message = "Conta invalida!";

				//Saida função
				return;
			}

			//Limpa a mensagem
			$scope.message = "";

			//Salca a conta na sessão
			$sessionStorage.account = data;

			//Redireciona para a área do cliente
			$location.path("/client");
		})
		.error(function(data, status){
			//Mostra mensagem de erro
			$scope.message = "Aconteceu um problema!";
		});
	};

	//Sair da conta
	$scope.signOut = function(){
		//Limpa a mensagem
		$scope.message = "";

		//Salca a conta na sessão
		$sessionStorage.account = {};

		//Redireciona para a área do cliente
		$location.path("/access");
	};

	//Verifica se é para mostrar a mensagem
	$scope.isMessage = function(){
		//Retorna se é para mostrar a mensagem
		return ($scope.message != "");
	}

	//Vai para a tela de transferencia
	$scope.goTransfer = function(){
		//Redireciona para a área do cliente
		$location.path("/transfer");
	};

	//Fazer a transferência
	$scope.transfer = function(account, accountCredit, valueTransfer){
		//Converte em inteiro
		valueTransfer = Number(valueTransfer);

		//Faz verificações no FRONT-END, mas essas mesmas verificações serão feitas no BACK-END
		//Faz requisição para verificar a existencia da conta debitada
		accountAPI.getAccount(account.id)
		.success(function(dataDebit, status){
			//Verifica se retornou vazio
			if (!('id' in dataDebit)){
				//Mostra mensagem de erro
				$scope.message = "Conta debitada invalida.";

				//Saida função
				return;
			}

			//Verifica se o valor é maior que o disponível
			if (valueTransfer > dataDebit.saldo){
				//Mostra mensagem de erro
				$scope.message = "Valor a ser debitado indisponível.";

				//Saida função
				return;
			}

			//Faz requisição para verificar a existencia da conta creditada
			accountAPI.getAccountByNumber(accountCredit.agency, accountCredit.number)
			.success(function(dataCredit, status){
				//Verifica se retornou vazio
				if (!('id' in dataCredit)){

					//Mostra mensagem de erro
					$scope.message = "Conta creditada invalida.";

					//Saida função
					return;
				}

				//Coloca os dados de transferencia na Sessão
				$sessionStorage.transfer = {
					dataD: dataDebit,
					dataC: dataCredit,
					v: valueTransfer
				};

				//Mostra os dados de transferencia na tela
				$scope.transferData = $sessionStorage.transfer;

				//Exige a confirmação do usuário
				$("#modalConfirm").modal("show");

				//Limpa a mensagem
				$scope.message = "";
			})
			.error(function(dataCredit, status){
				//Mostra mensagem de erro
				$scope.message = "Aconteceu um problema!";
			});
		})
		.error(function(dataDebit, status){
			//Mostra mensagem de erro
			$scope.message = "Aconteceu um problema!";
		});
	};

	//Confirma a transferência
	$scope.transferConfirm = function(){
		//Faz a transferencia
		accountAPI.transfer($sessionStorage.transfer)
		.success(function(data, status){
			//Tira o modal de confirmação
			$('#modalConfirm').modal("hide");

			//Verifica se houve erro
			if (!data.success){
				//Mostra mensagem de erro
				$scope.message = data.msg;

				//Saida função
				return;
			}

			//Atualiza o valor na tela
			$sessionStorage.account.saldo = $sessionStorage.transfer.dataD.saldo - $sessionStorage.transfer.v;

			//Redireciona para a área do cliente
			$location.path("/transferSuccess");
		})
		.error(function(data, status){
			//Mostra mensagem de erro
			$scope.message = "Aconteceu um problema!";
		});
	};
});