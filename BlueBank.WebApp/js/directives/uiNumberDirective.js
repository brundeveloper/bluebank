//Diretiva para formatar numeros
angular.module("blueBank").directive("uiNumber", function($filter){
	//Retorno da diretiva
	return {
		require: "ngModel",
		link: function(scope, element, attrs, ctrl){
			var dig = Number(attrs.uiNumber);

			var _formatNumber = function(number){
				if (number){
					number = number.replace(/[^0-9]+/g, "");

					if (number.length > dig){
						number = number.substring(0, dig);
					}
				}

				return number;
			};

			element.bind("keyup", function(){
				ctrl.$setViewValue(_formatNumber(ctrl.$viewValue));
				ctrl.$render();
			});

			ctrl.$parsers.push(function(value){
				if (value.length === dig){
					return value;
				}
			});

			ctrl.$formatters.push(function(value){
				return value;
			});
		}
	};
});