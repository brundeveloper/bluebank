//Diretiva para formatar numeros
angular.module("blueBank").directive("uiNumber", function($filter){
	//Retorno da diretiva
	return {
		require: "ngModel",
		link: function(scope, element, attrs, ctrl){
			//Obtem o limite de digitos
			var dig = Number(attrs.uiNumber);

			//Formatador de numeros
			var _formatNumber = function(number){
				//Verifica se foi digitado algo
				if (number){
					//Obtem apenas os numeros
					number = number.replace(/[^0-9]+/g, "");

					//Verifica se a quantidade de digitos é maior que o limite
					if (number.length > dig){
						//Retira os digitos que passaram do limite
						number = number.substring(0, dig);
					}
				}

				//Retorna o numero formatado
				return number;
			};

			//Quando digitar
			element.bind("keyup", function(){
				//Formata o numero
				ctrl.$setViewValue(_formatNumber(ctrl.$viewValue));

				//Renderiza
				ctrl.$render();
			});

			//Empilha
			ctrl.$parsers.push(function(value){
				//Verifica se esta na quantidade de limite
				if (value.length === dig){
					//Retorna o valor
					return value;
				}
			});

			//Empilha a formatação
			ctrl.$formatters.push(function(value){
				//Retorna o valor
				return value;
			});
		}
	};
});