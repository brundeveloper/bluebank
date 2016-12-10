//Importa o Roteador
var router = require("./router");

//Importa as rotas
var routes = require("./routes");

//Guarda o roteamento
var app = router(3412);

//Monta as rotas
routes(app);