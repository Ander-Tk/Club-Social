const socket = io(); // cliente X servidor

//Login*
var LoginDiv = document.getElementById('LoginDiv');
var UserLogin = document.getElementById('UserLogin');
var PasswordLogin  = document.getElementById('PasswordLogin');
var LoginBtn = document.getElementById('LoginBtn');
var RegLog = document.getElementById('Reg-Log');

//Registro*
var RegistroDiv = document.getElementById('RegistroDiv');
var UserRegistro = document.getElementById('UserRegistro');
var PasswordRegistro  = document.getElementById('PasswordRegistro');
var RegistroBtn = document.getElementById('RegistroBtn');
var LogReg = document.getElementById('Log-Reg');

//Game
var GameDiv = document.getElementById('GameDiv');

//Escolha da Base
function BaseValue() {
    var Base = document.getElementsByName('RadioBase');
    for (i = 0; i < Base.length; i++) {
        if (Base[i].checked)
            return Base[i].value;
    }
}
//Escolha da Roupa
function RoupaValue() {
    var Roupa = document.getElementsByName('RadioRoupa');
    for (i = 0; i < Roupa.length; i++) {
        if (Roupa[i].checked)
            return Roupa[i].value;
    }
}
//Escolha do Cabelo
function CabeloValue() {
    var Cabelo = document.getElementsByName('RadioCabelo');
    for (i = 0; i < Cabelo.length; i++) {
        if (Cabelo[i].checked)
            return Cabelo[i].value;
    }
}

//Escolha do Adicional
function AdicionalValue() {
    var Adicional = document.getElementsByName('RadioAdicional');
    for (i = 0; i < Adicional.length; i++) {
        if (Adicional[i].checked)
            return Adicional[i].value;
    }
}

LoginBtn.onclick = function () {
    if(UserLogin.value === '' || PasswordLogin.value === ''){ //Só pode entrar com um nome de usuário.
        return
    }else{
    socket.emit('Login', { username: UserLogin.value, password: PasswordLogin.value });
    }
}

RegistroBtn.onclick = function () {
    if(UserRegistro.value === '' || PasswordRegistro.value === ''){ //Só pode Cadastrar com um nome de usuário e senha.
        return
    }else{
    socket.emit('Registro', { username: UserRegistro.value, password: PasswordRegistro.value, base: BaseValue(), roupa: RoupaValue(), cabelo: CabeloValue() });
    }
}

RegLog.onclick = function(){
    LoginDiv.style.display = 'none';
    RegistroDiv.style.display = 'block';
}
LogReg.onclick = function(){
    LoginDiv.style.display = 'block';
    RegistroDiv.style.display = 'none';
}

socket.on('LoginResp', function (data) {
    if (data.success) {//Torna visivel o Jogo.
        GameDiv.style.display = 'inline-block';
        //Destroi as guias Login//Registro
        LoginDiv.remove();
        RegistroDiv.remove();
    }else{alert("Err");}
});

socket.on('RegistroResp', function (data) {
    if(data.success){
        alert("Cadastrado com sucesso");
    }else{alert("Err");}
});

//Interface
var GameUI = document.getElementById("GameUI");
var DesenhoDiv = document.getElementById("DesenhoDiv");
var LojaDiv = document.getElementById("LojaDiv");
var DrawMenu = document.getElementById("DrawMenu");
var DrawPintor = document.getElementById("DrawPintor");

//Loja de Roupas
var LojaRoupaDiv = document.getElementById("LojaRoupaDiv");
var UpdateRoupa = document.getElementById("UpdateRoupa");
var LojaBtn = document.getElementById("LojaBtn");
var closeLoja = document.getElementsByClassName("closeLoja")[0];

LojaBtn.onclick = function () { 
    player = Player.list[selfID]; //Pega o  jogador
    //Config Componentes + URL
    Base = document.getElementById("Bases"); BaseURL = '/Client/Sprites/Preview/PreviewBase/';
    Roupa = document.getElementById("Roupas"); RoupaURL = '/Client/Sprites/Preview/PreviewRoupa/';
    Cabelo = document.getElementById("Cabelos"); CabeloURL = '/Client/Sprites/Preview/PreviewCabelo/';
    Adicional = document.getElementById("Adicional"); AdicionalURL = '/Client/Sprites/Preview/PreviewAdicional/';

    //Roupas do Jogador
    BasePlayer = player.base.charAt(0) + Number(player.base.split('-')[1]);
    RoupaPlayer = player.roupa.charAt(0) + Number(player.roupa.split('-')[1]);
    CabeloPlayer = player.cabelo.charAt(0) + Number(player.cabelo.split('-')[1]);
    AdicionalPlayer = 'ADC' + Number(player.adicional.split('-')[1]);
    
    //Coloca na Preview a roupa atual do jogador
    Base.src = BaseURL + BasePlayer + ".png";
    Roupa.src = RoupaURL + RoupaPlayer + ".png";
    Cabelo.src = CabeloURL + CabeloPlayer + ".png";
    Adicional.src = AdicionalURL + AdicionalPlayer + ".png";
    
    //Torna a Loja visivel 
    LojaRoupaDiv.style.display = "block";
}
closeLoja.onclick = function () { LojaRoupaDiv.style.display = "none"; } //Fecha a  loja

//Update Roupas
UpdateRoupa.onclick = function () {
    player = Player.list[selfID]; //Pega o  jogador
    Roupa  = RoupaValue(); Cabelo = CabeloValue(); Adicional = AdicionalValue();
    
    if(Roupa === undefined){ Roupa = player.roupa}
    if(Cabelo === undefined){ Cabelo = player.cabelo}
    if(Adicional === undefined){ Adicional = player.adicional}
    
    socket.emit('UpdateRoupa', { id:player.id, username: player.Name, roupa: Roupa, cabelo: Cabelo, adicional: Adicional });

    //Fecha a Loja
    LojaRoupaDiv.style.display = "none";
}

//Mapa
var ModalMap = document.getElementById("ModalMap");
var MapBtn = document.getElementById("ModalMapBtn");
var CloseSpan = document.getElementsByClassName("close")[0];

MapBtn.onclick = function () { ModalMap.style.display = "block"; }
CloseSpan.onclick = function () { ModalMap.style.display = "none"; }

//Trocar de mapa selecionando.
var changeMap = function (Mapa, PosX, PosY) {
    socket.emit('changeMap', { Mapa: Mapa, OldMap: Player.list[selfID].Map, PosX: PosX, PosY:PosY});
    ModalMap.style.display = "none"; // Fecha o mapa
}
//Rota
var Rotas = function(){
    player = Player.list[selfID]
    if(player.Rota == 'Floresta'){
        socket.emit('Rota');
        socket.emit('changeMap', { Mapa: 'Floresta', OldMap: Player.list[selfID].Map, PosX: 370, PosY: 350});
    }
    else if(player.Rota == 'RotaFloresta'){
        socket.emit('Rota');
        socket.emit('changeMap', { Mapa: 'RotaFloresta', OldMap: Player.list[selfID].Map, PosX: 375, PosY: 70});
    }
    //Saídas no Centro
    else if(player.Rota == 'Rota-Centro'){
        socket.emit('Rota');
        socket.emit('changeMap', { Mapa: 'Centro', OldMap: Player.list[selfID].Map, PosX: 500, PosY: 80});
    }
    else if(player.Rota == 'Café-Centro'){
        socket.emit('Rota');
        socket.emit('changeMap', { Mapa: 'Centro', OldMap: Player.list[selfID].Map, PosX: 230, PosY: 165});
    }
    else if(player.Rota == 'Praia-Centro'){
        socket.emit('Rota');
        socket.emit('changeMap', { Mapa: 'Centro', OldMap: Player.list[selfID].Map, PosX: 485, PosY: 375});
    }
    else if(player.Rota == 'Loja-Centro'){
        socket.emit('Rota');
        socket.emit('changeMap', { Mapa: 'Centro', OldMap: Player.list[selfID].Map, PosX: 90, PosY: 170});
    }
    else if(player.Rota == 'Escola-Centro'){
        socket.emit('Rota');
        socket.emit('changeMap', { Mapa: 'Centro', OldMap: Player.list[selfID].Map, PosX: 745, PosY: 170});
    }
    //Caminhos do Centro
    else if(player.Rota == 'Centro-Praia'){
        socket.emit('Rota');
        socket.emit('changeMap', { Mapa: 'Praia', OldMap: Player.list[selfID].Map, PosX: 480, PosY: 75});
    }
    else if(player.Rota == 'Centro-Rota'){
        socket.emit('Rota');
        socket.emit('changeMap', { Mapa: 'RotaFloresta', OldMap: Player.list[selfID].Map, PosX: 510, PosY: 395});
    }
    else if(player.Rota == 'Centro-Café'){
        socket.emit('Rota');
        socket.emit('changeMap', { Mapa: 'Cafe', OldMap: Player.list[selfID].Map, PosX: 520, PosY: 375}); 
    }
    else if(player.Rota == 'Centro-Loja'){
        socket.emit('Rota');
        socket.emit('changeMap', { Mapa: 'Loja', OldMap: Player.list[selfID].Map, PosX: 340, PosY: 375});
    }
    else if(player.Rota == 'Centro-Escola'){
        socket.emit('Rota');
        socket.emit('changeMap', { Mapa: 'Escola', OldMap: Player.list[selfID].Map, PosX: 660, PosY: 375});
    }
}

//Chat
var ChatBox = document.getElementById("ChatBox");
var ChatInput = document.getElementById("ChatInput");
var ChatForm = document.getElementById("ChatForm");

//sistema de Chat
socket.on('ToChat', function (data, SenderID, PlayerColor) {
    var intervalID = setInterval(function () { //Atualiza a posição da mensagem a cada 10 milisecundos
        for (var i in Player.list)
            if (Player.list[i].id === SenderID)
                ChatBox.innerHTML += '<div id="bubble" style="top:' + (Player.list[i].y - 62) + 'px; left:' + (Player.list[i].x - 20) + 'px;"><strong style="color:#' + PlayerColor + ';">' + (Player.list[i].Name) + '</strong><p>' + data + '</p></div>';

        setTimeout(function () {//Remove a mensagem a cada 25 milisegundos
            ChatBox.removeChild(ChatBox.firstChild);
        }, 25);
        setTimeout(function () {//Remove o loop das mensagens em 3 segundos
            clearInterval(intervalID);
        }, 3000);
    }, 10);

});
//Impede reload + emit msg
ChatForm.onsubmit = function (e) {
    e.preventDefault();
    socket.emit('MsgToServer', ChatInput.value, socket.id, Player.list[selfID].Map);
    ChatInput.value = '';
    ChatInput.blur() //Tira o Foco do input depois de  enviar a msg
}

//Impede menu de opções
//document.oncontextmenu = function(event){event.preventDefault();}

//canvas
var canvas = document.getElementById("ctx");
var ctx = canvas.getContext("2d");
const ctxWidth = 800; const ctxHeight = 480; //Tamanho do canvas
ctx.imageSmoothingEnabled = false; //Imagem bem definida

//Game Canvas
var GameCanvas = document.getElementById("GameCanvas");
var ctxGame = GameCanvas.getContext("2d");
const ctxGameWidth = 800; const ctxGameHeight = 480; //Tamanho do canvas
ctxGame.imageSmoothingEnabled = false; //Imagem bem definida

//Game Assets
const Img = {};
Img.player = new Image();
Img.Map = new Image();

//Base Player
Img.player['Base-00'] = new Image();
Img.player['Base-00'].src = "/Client/Sprites/Base/Base-00.png";
Img.player['Base-01'] = new Image();
Img.player['Base-01'].src = "/Client/Sprites/Base/Base-01.png";
Img.player['Base-02'] = new Image();
Img.player['Base-02'].src = "/Client/Sprites/Base/Base-02.png";
Img.player['Base-03'] = new Image();
Img.player['Base-03'].src = "/Client/Sprites/Base/Base-03.png";

//Roupas Player
Img.player['Roupa-00'] = new Image(); //Verde
Img.player['Roupa-00'].src = "/Client/Sprites/Roupa/Roupa-00.png";
Img.player['Roupa-01'] = new Image(); //Azul
Img.player['Roupa-01'].src = "/Client/Sprites/Roupa/Roupa-01.png";
Img.player['Roupa-02'] = new Image(); //Vermelho
Img.player['Roupa-02'].src = "/Client/Sprites/Roupa/Roupa-02.png";
Img.player['Roupa-03'] = new Image(); //Roxo
Img.player['Roupa-03'].src = "/Client/Sprites/Roupa/Roupa-03.png";
Img.player['Roupa-04'] = new Image(); //Rosa
Img.player['Roupa-04'].src = "/Client/Sprites/Roupa/Roupa-04.png";
Img.player['Roupa-05'] = new Image(); //Amarelo
Img.player['Roupa-05'].src = "/Client/Sprites/Roupa/Roupa-05.png";
Img.player['Roupa-06'] = new Image(); //Vestido Azul
Img.player['Roupa-06'].src = "/Client/Sprites/Roupa/Roupa-06.png";
Img.player['Roupa-07'] = new Image(); //Vestido Verde
Img.player['Roupa-07'].src = "/Client/Sprites/Roupa/Roupa-07.png";
Img.player['Roupa-08'] = new Image(); //Vestido Roxo
Img.player['Roupa-08'].src = "/Client/Sprites/Roupa/Roupa-08.png";
Img.player['Roupa-09'] = new Image(); //Vestido Vermelho
Img.player['Roupa-09'].src = "/Client/Sprites/Roupa/Roupa-09.png";
// +Roupas
Img.player['Roupa-10'] = new Image();
Img.player['Roupa-10'].src = "/Client/Sprites/Roupa/Roupa-10.png";
Img.player['Roupa-11'] = new Image(); 
Img.player['Roupa-11'].src = "/Client/Sprites/Roupa/Roupa-11.png";
Img.player['Roupa-12'] = new Image(); 
Img.player['Roupa-12'].src = "/Client/Sprites/Roupa/Roupa-12.png";
Img.player['Roupa-13'] = new Image(); 
Img.player['Roupa-13'].src = "/Client/Sprites/Roupa/Roupa-13.png";
Img.player['Roupa-14'] = new Image(); 
Img.player['Roupa-14'].src = "/Client/Sprites/Roupa/Roupa-14.png";
Img.player['Roupa-15'] = new Image(); 
Img.player['Roupa-15'].src = "/Client/Sprites/Roupa/Roupa-15.png";
Img.player['Roupa-16'] = new Image();
Img.player['Roupa-16'].src = "/Client/Sprites/Roupa/Roupa-16.png";
Img.player['Roupa-17'] = new Image();
Img.player['Roupa-17'].src = "/Client/Sprites/Roupa/Roupa-17.png";
Img.player['Roupa-18'] = new Image();
Img.player['Roupa-18'].src = "/Client/Sprites/Roupa/Roupa-18.png";
Img.player['Roupa-19'] = new Image();
Img.player['Roupa-19'].src = "/Client/Sprites/Roupa/Roupa-19.png";

//Cabelo Player
Img.player['Cabelo-00'] = new Image();
Img.player['Cabelo-00'].src = "/Client/Sprites/Cabelo/Cabelo-00.png";
Img.player['Cabelo-01'] = new Image();
Img.player['Cabelo-01'].src = "/Client/Sprites/Cabelo/Cabelo-01.png";
Img.player['Cabelo-02'] = new Image();
Img.player['Cabelo-02'].src = "/Client/Sprites/Cabelo/Cabelo-02.png";
Img.player['Cabelo-03'] = new Image();
Img.player['Cabelo-03'].src = "/Client/Sprites/Cabelo/Cabelo-03.png";
Img.player['Cabelo-04'] = new Image();
Img.player['Cabelo-04'].src = "/Client/Sprites/Cabelo/Cabelo-04.png";
Img.player['Cabelo-05'] = new Image();
Img.player['Cabelo-05'].src = "/Client/Sprites/Cabelo/Cabelo-05.png";
Img.player['Cabelo-06'] = new Image();
Img.player['Cabelo-06'].src = "/Client/Sprites/Cabelo/Cabelo-06.png";
Img.player['Cabelo-07'] = new Image();
Img.player['Cabelo-07'].src = "/Client/Sprites/Cabelo/Cabelo-07.png";
Img.player['Cabelo-08'] = new Image();
Img.player['Cabelo-08'].src = "/Client/Sprites/Cabelo/Cabelo-08.png";
Img.player['Cabelo-09'] = new Image();
Img.player['Cabelo-09'].src = "/Client/Sprites/Cabelo/Cabelo-09.png";
Img.player['Cabelo-10'] = new Image();
Img.player['Cabelo-10'].src = "/Client/Sprites/Cabelo/Cabelo-10.png";
Img.player['Cabelo-11'] = new Image();
Img.player['Cabelo-11'].src = "/Client/Sprites/Cabelo/Cabelo-11.png";
Img.player['Cabelo-12'] = new Image();
Img.player['Cabelo-12'].src = "/Client/Sprites/Cabelo/Cabelo-12.png";
Img.player['Cabelo-13'] = new Image();
Img.player['Cabelo-13'].src = "/Client/Sprites/Cabelo/Cabelo-13.png";
Img.player['Cabelo-14'] = new Image();
Img.player['Cabelo-14'].src = "/Client/Sprites/Cabelo/Cabelo-14.png";
Img.player['Cabelo-15'] = new Image();
Img.player['Cabelo-15'].src = "/Client/Sprites/Cabelo/Cabelo-15.png";
Img.player['Cabelo-16'] = new Image();
Img.player['Cabelo-16'].src = "/Client/Sprites/Cabelo/Cabelo-16.png";
Img.player['Cabelo-17'] = new Image();
Img.player['Cabelo-17'].src = "/Client/Sprites/Cabelo/Cabelo-17.png";
// +Cabelos
Img.player['Cabelo-18'] = new Image();
Img.player['Cabelo-18'].src = "/Client/Sprites/Cabelo/Cabelo-18.png";
Img.player['Cabelo-19'] = new Image();
Img.player['Cabelo-19'].src = "/Client/Sprites/Cabelo/Cabelo-19.png";
Img.player['Cabelo-20'] = new Image();
Img.player['Cabelo-20'].src = "/Client/Sprites/Cabelo/Cabelo-20.png";
Img.player['Cabelo-21'] = new Image();
Img.player['Cabelo-21'].src = "/Client/Sprites/Cabelo/Cabelo-21.png";
Img.player['Cabelo-22'] = new Image();
Img.player['Cabelo-22'].src = "/Client/Sprites/Cabelo/Cabelo-22.png";
Img.player['Cabelo-23'] = new Image();
Img.player['Cabelo-23'].src = "/Client/Sprites/Cabelo/Cabelo-23.png";
Img.player['Cabelo-24'] = new Image();
Img.player['Cabelo-24'].src = "/Client/Sprites/Cabelo/Cabelo-24.png";
Img.player['Cabelo-25'] = new Image();
Img.player['Cabelo-25'].src = "/Client/Sprites/Cabelo/Cabelo-25.png";
Img.player['Cabelo-26'] = new Image();
Img.player['Cabelo-26'].src = "/Client/Sprites/Cabelo/Cabelo-26.png";
Img.player['Cabelo-27'] = new Image();
Img.player['Cabelo-27'].src = "/Client/Sprites/Cabelo/Cabelo-27.png";

//Item Adicional
Img.player['Adc-00'] = new Image();
Img.player['Adc-00'].src = "/Client/Sprites/Adicional/Adc-00.png";
Img.player['Adc-01'] = new Image();
Img.player['Adc-01'].src = "/Client/Sprites/Adicional/Adc-01.png";
Img.player['Adc-02'] = new Image();
Img.player['Adc-02'].src = "/Client/Sprites/Adicional/Adc-02.png";
Img.player['Adc-03'] = new Image();
Img.player['Adc-03'].src = "/Client/Sprites/Adicional/Adc-03.png";
Img.player['Adc-04'] = new Image();
Img.player['Adc-04'].src = "/Client/Sprites/Adicional/Adc-04.png";
Img.player['Adc-05'] = new Image();
Img.player['Adc-05'].src = "/Client/Sprites/Adicional/Adc-05.png";
Img.player['Adc-06'] = new Image();
Img.player['Adc-06'].src = "/Client/Sprites/Adicional/Adc-06.png";
Img.player['Adc-07'] = new Image();
Img.player['Adc-07'].src = "/Client/Sprites/Adicional/Adc-07.png";

//Mapas
Img.Map['Centro'] = new Image();
Img.Map['Centro'].src = "/Client/Sprites/Mapas/Centro.png";
Img.Map['Floresta'] = new Image();
Img.Map['Floresta'].src = "/Client/Sprites/Mapas/floresta.png";
Img.Map['RotaFloresta'] = new Image();
Img.Map['RotaFloresta'].src = "/Client/Sprites/Mapas/RotaFloresta.png";
Img.Map['Praia'] = new Image();
Img.Map['Praia'].src = "/Client/Sprites/Mapas/praia.png";
Img.Map['Cafe'] = new Image();
Img.Map['Cafe'].src = "/Client/Sprites/Mapas/cafe.png";
Img.Map['Escola'] = new Image();
Img.Map['Escola'].src = "/Client/Sprites/Mapas/escola.png";
Img.Map['Loja'] = new Image();
Img.Map['Loja'].src = "/Client/Sprites/Mapas/loja.png";

//Casa [Layout, Pisos, Paredes]
Img.Map['Layout-00'] = new Image();
Img.Map['Layout-00'].src = "/Client/Sprites/Casa/Layout/Layout-00.png";
Img.Map['Layout-01'] = new Image();
Img.Map['Layout-01'].src = "/Client/Sprites/Casa/Layout/Layout-01.png";
Img.Map['Layout-02'] = new Image();
Img.Map['Layout-02'].src = "/Client/Sprites/Casa/Layout/Layout-02.png";
Img.Map['Layout-03'] = new Image();
Img.Map['Layout-03'].src = "/Client/Sprites/Casa/Layout/Layout-03.png";
//Pisos
Img.Map['floor-00'] = new Image();
Img.Map['floor-00'].src = "/Client/Sprites/Casa/Piso/floor-00.png";
Img.Map['floor-01'] = new Image();
Img.Map['floor-01'].src = "/Client/Sprites/Casa/Piso/floor-01.png";
Img.Map['floor-02'] = new Image();
Img.Map['floor-02'].src = "/Client/Sprites/Casa/Piso/floor-02.png";
Img.Map['floor-03'] = new Image();
Img.Map['floor-03'].src = "/Client/Sprites/Casa/Piso/floor-03.png";
Img.Map['floor-04'] = new Image();
Img.Map['floor-04'].src = "/Client/Sprites/Casa/Piso/floor-04.png";
Img.Map['floor-05'] = new Image();
Img.Map['floor-05'].src = "/Client/Sprites/Casa/Piso/floor-05.png";
Img.Map['floor-06'] = new Image();
Img.Map['floor-06'].src = "/Client/Sprites/Casa/Piso/floor-06.png";
//Paredes
Img.Map['wall-00'] = new Image();
Img.Map['wall-00'].src = "/Client/Sprites/Casa/Parede/wall-00.png";
Img.Map['wall-01'] = new Image();
Img.Map['wall-01'].src = "/Client/Sprites/Casa/Parede/wall-01.png";
Img.Map['wall-02'] = new Image();
Img.Map['wall-02'].src = "/Client/Sprites/Casa/Parede/wall-02.png";
Img.Map['wall-03'] = new Image();
Img.Map['wall-03'].src = "/Client/Sprites/Casa/Parede/wall-03.png";
Img.Map['wall-04'] = new Image();
Img.Map['wall-04'].src = "/Client/Sprites/Casa/Parede/wall-04.png";
Img.Map['wall-05'] = new Image();
Img.Map['wall-05'].src = "/Client/Sprites/Casa/Parede/wall-05.png";
Img.Map['wall-06'] = new Image();
Img.Map['wall-06'].src = "/Client/Sprites/Casa/Parede/wall-06.png";
Img.Map['wall-07'] = new Image();
Img.Map['wall-07'].src = "/Client/Sprites/Casa/Parede/wall-07.png";
Img.Map['wall-08'] = new Image();
Img.Map['wall-08'].src = "/Client/Sprites/Casa/Parede/wall-08.png";
Img.Map['wall-09'] = new Image();
Img.Map['wall-09'].src = "/Client/Sprites/Casa/Parede/wall-09.png";
Img.Map['wall-10'] = new Image();
Img.Map['wall-10'].src = "/Client/Sprites/Casa/Parede/wall-10.png";
Img.Map['wall-11'] = new Image();
Img.Map['wall-11'].src = "/Client/Sprites/Casa/Parede/wall-11.png";
Img.Map['wall-12'] = new Image();
Img.Map['wall-12'].src = "/Client/Sprites/Casa/Parede/wall-12.png";
Img.Map['wall-13'] = new Image();
Img.Map['wall-13'].src = "/Client/Sprites/Casa/Parede/wall-13.png";
Img.Map['wall-14'] = new Image();
Img.Map['wall-14'].src = "/Client/Sprites/Casa/Parede/wall-14.png";
Img.Map['wall-15'] = new Image();
Img.Map['wall-15'].src = "/Client/Sprites/Casa/Parede/wall-15.png";
Img.Map['wall-16'] = new Image();
Img.Map['wall-16'].src = "/Client/Sprites/Casa/Parede/wall-16.png";

//Desenha o mapa
drawMap = function () {
    var player = Player.list[selfID];
    //Tamanho dos Mapas
    var MapWidth = 400;
    var MapHeight = 240;

    if (Gamelist.includes(player.Map)) {
        return; //Se estiver jogando não desenha o Mapa
    }else if((player.Map.split(' ')[0]) === 'Casa' && (player.Map.split(' ')[1]) === player.Name){
		ctx.drawImage(Img.Map[player.piso], 0, 0, MapWidth * 2, MapHeight * 2);
		ctx.drawImage(Img.Map[player.parede], 0, 0, MapWidth * 2, MapHeight * 2);
		ctx.drawImage(Img.Map[player.layout], 0, 0, MapWidth * 2, MapHeight * 2);
    }else if((player.Map.split(' ')[0]) === 'Casa' && (player.Map.split(' ')[1]) != player.Name){
		ctx.drawImage(Img.Map[player.pisoVst], 0, 0, MapWidth * 2, MapHeight * 2);
		ctx.drawImage(Img.Map[player.paredeVst], 0, 0, MapWidth * 2, MapHeight * 2);
		ctx.drawImage(Img.Map[player.layoutVst], 0, 0, MapWidth * 2, MapHeight * 2);
    }else {
        ctx.drawImage(Img.Map[player.Map], 0, 0, MapWidth * 2, MapHeight * 2);
    }
}

//Lista de Jogos
Gamelist = ['Desenho', 'OutroJogo'];

//Variaveis do Desenho
var current = {color: 'black'};
var colors = document.getElementsByClassName('color');
var TemaDiv = document.getElementById('TemaDiv');
var PalavraDiv = document.getElementById('PalavraDiv');
var drawing = false;
var PintorAtual =  null;
var PalavraAtual = null;
var TemaAtual = null;

//Logica dos minigames
var GameLogic = function () {
    switch(Player.list[selfID].Map){
        case 'Desenho':
            GameCanvas.style.display = "block";
            canvas.style.display = "none"; 
            GameUI.style.display =  "none";
            DrawMenu.style.display =  "block";

            //Config Mensagem de Espera
            ctxGame.font="50px Arial"; ctxGame.textAlign = "center"; ctxGame.fillStyle = "black";

            for (var i = 0; i < colors.length; i++){
                colors[i].addEventListener('click', onColorUpdate, false);
            }

            JogadoresDesenhando();
            if(PlayerDesenho.length < 2){
                DrawPintor.style.display =  "none";
                DrawMenu.style.display =  "block";
                AtualizaLista(PlayerDesenho);
                if (PalavraDiv.hasChildNodes()) {PalavraDiv.removeChild(PalavraDiv.firstChild);}
                if (TemaDiv.hasChildNodes()) {TemaDiv.removeChild(TemaDiv.firstChild);}
                //Mensagem de Espera
                ctxGame.clearRect(0, 0, ctxWidth, ctxHeight); //Limpa o canvas.
                ctxGame.strokeText("Aguardando Jogadores",  ctxWidth/2, ctxHeight/2);

                try{
                    //Remove Eventos
                    document.removeEventListener('mousedown', onMouseDown, false);
                    document.removeEventListener('mouseup', onMouseUp, false);
                    document.removeEventListener('mouseout', onMouseUp, false);
                    document.removeEventListener('mousemove', throttle(onMouseMove, 100), false);
                }
                catch(e){
                    console.log(e)
                }
                
            }
            else if (PlayerDesenho.length >= 2){
                DrawRunLista()
                socket.emit('JogadoresDesenhando', PlayerDesenho);
                if(selfID === PintorAtual){
                    DrawPintor.style.display =  "block";
                    DrawMenu.style.display =  "none";
                    //Eventos
                    document.addEventListener('mousedown', onMouseDown, false);
                    document.addEventListener('mouseup', onMouseUp, false);
                    document.addEventListener('mouseout', onMouseUp, false);
                    document.addEventListener('mousemove', throttle(onMouseMove, 100), false);
                }else{
                    DrawPintor.style.display =  "none";
                    DrawMenu.style.display =  "block";
                    //Remove Eventos
                    document.removeEventListener('mousedown', onMouseDown, false);
                    document.removeEventListener('mouseup', onMouseUp, false);
                    document.removeEventListener('mouseout', onMouseUp, false);
                    document.removeEventListener('mousemove', throttle(onMouseMove, 100), false);
                    return
                }
            }else if (PlayerDesenho.lenght > 5){ //Limitar numero de jogadores
                socket.emit('changeMap',{Mapa:'Escola', OldMap:Player.list[(PlayerDesenho[5])].Map});
            }

            break;
        case 'Escola':
            canvas.style.display = "block";
            GameUI.style.display =  "block";
            DesenhoDiv.style.display = 'block';
            GameCanvas.style.display = "none"; 
            DrawMenu.style.display =  "none";
            DrawPintor.style.display =  "none";

            break;
        case 'Loja':
            GameCanvas.style.display = "none"; 
            canvas.style.display = "block";
            GameUI.style.display =  "block";
            LojaDiv.style.display = "block";    
            break;
        default:
            canvas.style.display = "block";
            GameUI.style.display =  "block";
            LojaDiv.style.display = "none";  
            DesenhoDiv.style.display = 'none';
            GameCanvas.style.display = "none"; 
            DrawMenu.style.display =  "none";
            DrawPintor.style.display =  "none";
            break;
    }
}

//Funções Para o  desenho
socket.on('Desenhando', onDrawingEvent);

//Executar apenas uma vez
var DrawLista_run = 0;
//Atualiaza a Lista quando Jogadores < 2
function AtualizaLista(PlayerDesenho){
    if(DrawLista_run == 0){
        socket.emit('AtualizaLista', PlayerDesenho);
        PintorAtual = null;
        DrawLista_run = 1;
    }
}
//Quando Jogadores > 2 Voltar DrawLista_run para 0
function DrawRunLista(){
    if(DrawLista_run != 0){
        DrawLista_run = 0;
    }
}

//Ninguém Acertou o  desenho
socket.on('TempoEsgotado', function () {
    TempoEsgotado()
    if (PalavraDiv.hasChildNodes()) {PalavraDiv.removeChild(PalavraDiv.firstChild);}
    if (TemaDiv.hasChildNodes()) {TemaDiv.removeChild(TemaDiv.firstChild);}
});

function TempoEsgotado(){      
    ChatBox.innerHTML += '<div id="ResultadoDraw"><p>Tempo Esgotado</p><p>Ninguém Acertou a Palavra</p></div>';
    setTimeout(function () {//Remove em 4.5 segundos
        ChatBox.removeChild(ChatBox.firstChild);
    }, 4500);
//Remove palavra e tema anterior
if (PalavraDiv.hasChildNodes()) {PalavraDiv.removeChild(PalavraDiv.firstChild);}
if (TemaDiv.hasChildNodes()) {TemaDiv.removeChild(TemaDiv.firstChild);}
}

//Acertou o Desenho
socket.on('GanhadorDesenho', function (SenderID, PlayerColor) {
    GanhadorDraw(SenderID, PlayerColor)
    if (PalavraDiv.hasChildNodes()) {PalavraDiv.removeChild(PalavraDiv.firstChild);}
    if (TemaDiv.hasChildNodes()) {TemaDiv.removeChild(TemaDiv.firstChild);}
});

function GanhadorDraw(SenderID, PlayerColor){      
        ChatBox.innerHTML += '<div id="ResultadoDraw"><p><strong style="color:#' + PlayerColor + ';">' + (Player.list[SenderID].Name) + '</strong> Acertou a Palavra</p></div>';
        setTimeout(function () {//Remove em 4.5 segundos
            ChatBox.removeChild(ChatBox.firstChild);
        }, 4500);
    //Remove palavra e tema anterior
    if (PalavraDiv.hasChildNodes()) {PalavraDiv.removeChild(PalavraDiv.firstChild);}
    if (TemaDiv.hasChildNodes()) {TemaDiv.removeChild(TemaDiv.firstChild);}
}

//Define  o Pintor, Palavra e Tema da rodada;
socket.on('Pintor', function (Pintor, PalavraChave, TemaDesenho) {
    //Remove palavra e tema anterior
    if (PalavraDiv.hasChildNodes()) {PalavraDiv.removeChild(PalavraDiv.firstChild);}
    if (TemaDiv.hasChildNodes()) {TemaDiv.removeChild(TemaDiv.firstChild);}

    PintorAtual = Pintor;
    PalavraAtual = PalavraChave;
    TemaAtual = TemaDesenho;

    if(selfID === PintorAtual){
        PalavraDiv.innerHTML+='<p class="DrawKey">Palavra: '+ PalavraChave +'</p>';
    }else{
        TemaDiv.innerHTML+='<p class="DrawKey"> Tema: '+ TemaDesenho +'</p>';
    }
});

function drawLine(x0, y0, x1, y1, color, emit){
    ctxGame.beginPath();
    ctxGame.moveTo(x0, y0);
    ctxGame.lineTo(x1, y1);
    ctxGame.strokeStyle = color;
    ctxGame.lineWidth = 2;
    ctxGame.stroke();
    ctxGame.closePath();

    if (!emit) { return; }
    var w = ctxWidth;
    var h = ctxHeight;

    socket.emit('Desenhando', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color
    });
}

function onColorUpdate(e){//Atualiza a cor do pincel.
    current.color = e.target.className.split(' ')[1];
}

// Emite a função clear
function Clear(){
    socket.emit('clear')
    ctxGame.clearRect(0, 0, ctxWidth, ctxHeight); //Limpa o canvas.
}

socket.on("clear", function(){
    ctxGame.clearRect(0, 0, ctxWidth, ctxHeight); //Limpa o canvas.
})

function onMouseDown(e){
    PosValida = (e.clientX - canvas.offsetLeft > e.offsetX && e.clientY - canvas.offsetTop > e.offsetY);
    if(PosValida){
        drawing = true;
        current.x = e.offsetX;
        current.y = e.offsetY;
    }
}

function onMouseMove(e){
    if (!drawing) { return; }
    drawLine(current.x, current.y, e.offsetX, e.offsetY, current.color, true);
    current.x = e.offsetX;
    current.y = e.offsetY;
}

function onMouseUp(e){
    if (!drawing) { return; }
    drawing = false;
    drawLine(current.x, current.y, e.offsetX, e.offsetY, current.color, true);
}

function onDrawingEvent(data){
    var w = ctxWidth;
    var h = ctxHeight;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
}

//Limita o numero de eventos
function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
}

//Jogadores Desenhando
var JogadoresDesenhando = function () {
    PlayerDesenho = [] //Cria lista de players no mapa desenho
    for (var i in Player.list)
        if (Player.list[i].Map === 'Desenho')
            PlayerDesenho.push(Player.list[i].id); //Adiciona os Players na lista.
    return PlayerDesenho;//Retorna os players na sala desenho
}

//Player
var Player = function (pack) {
    var self = {};
    self.id = pack.id
    self.Name = pack.username;
    self.Rota = pack.Rota;
    self.Map = pack.map;

    //Posição no canvas
    self.x = pack.x;
    self.y = pack.y;

    //Roupas
    self.base = pack.base;
    self.roupa = pack.roupa;
    self.cabelo = pack.cabelo;
    self.adicional = pack.adicional;

    //Casa Jogador
    self.layout = pack.layout;
    self.parede = pack.parede;
    self.piso = pack.piso;

    //Visitando Jogador
    self.layoutVst = pack.layoutVst;
    self.paredeVst = pack.paredeVst;
    self.pisoVst = pack.pisoVst;

    //Direções
    self.Right = pack.Right;
    self.Left = pack.Left;
    self.Up = pack.Up;
    self.Down = pack.Down;

    Player.list[self.id] = self;

    //Tamanho dos Sprites
    SpriteWidth = Img.player[self.base].width;
    SpriteHeight = Img.player[self.base].height;

    //Animação dos sprites
    FrameRight = 0;
    FrameLeft = 0;
    FrameUp = 0;
    FrameDown = 0;
    contador = 0;

    //Desenha o jogador
    self.drawPlayer = function () {
        if (Player.list[selfID].Map !== self.Map)
            return; //Desenha apenas os players no mesmo local;

        if (Gamelist.includes(self.Map))
            return; //Se estiver jogando[minigame] não desenha o player;

        if (self.Right) {
            contador++;
            if (contador % 2 == 0) {
                if (FrameRight < 3) { FrameRight++; }
                else FrameRight = 0;
            }
            ctx.drawImage(Img.player[self.base], 16 * FrameRight, 32, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
            ctx.drawImage(Img.player[self.roupa], 16 * FrameRight, 32, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
            ctx.drawImage(Img.player[self.cabelo], 16 * FrameRight, 32, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
            ctx.drawImage(Img.player[self.adicional], 16 * FrameRight, 32, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
        }
        else if (self.Left) {
            contador++;
            if (contador % 2 == 0) {
                if (FrameLeft < 3) { FrameLeft++; }
                else FrameLeft = 0;
            }
            ctx.drawImage(Img.player[self.base], 16 * FrameLeft, 96, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
            ctx.drawImage(Img.player[self.roupa], 16 * FrameLeft, 96, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
            ctx.drawImage(Img.player[self.cabelo], 16 * FrameLeft, 96, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
            ctx.drawImage(Img.player[self.adicional], 16 * FrameLeft, 96, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
        }
        else if (self.Up) {
            contador++;
            if (contador % 2 == 0) {
                if (FrameUp < 3) { FrameUp++; }
                else FrameUp = 0;
            }
            ctx.drawImage(Img.player[self.base], 16 * FrameUp, 64, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
            ctx.drawImage(Img.player[self.roupa], 16 * FrameUp, 64, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
            ctx.drawImage(Img.player[self.cabelo], 16 * FrameUp, 64, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
            ctx.drawImage(Img.player[self.adicional], 16 * FrameUp, 64, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
        }
        else if (self.Down) {
            contador++;
            if (contador % 2 == 0) {
                if (FrameDown < 3) { FrameDown++; }
                else FrameDown = 0;
            }
            ctx.drawImage(Img.player[self.base], 16 * FrameDown, 0, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
            ctx.drawImage(Img.player[self.roupa], 16 * FrameDown, 0, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
            ctx.drawImage(Img.player[self.cabelo], 16 * FrameDown, 0, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
            ctx.drawImage(Img.player[self.adicional], 16 * FrameDown, 0, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
        }
        else {
            ctx.drawImage(Img.player[self.base], 0, 0, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
            ctx.drawImage(Img.player[self.roupa], 0, 0, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
            ctx.drawImage(Img.player[self.cabelo], 0, 0, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
            ctx.drawImage(Img.player[self.adicional], 0, 0, SpriteWidth / 4, SpriteHeight / 4, (self.x - 10), (self.y - 45), SpriteWidth / 1.5, SpriteHeight / 1.5);
        }
    }
    return self;
}
Player.list = {};

var selfID = null;
//Init
socket.on('init', function (data) {
    if (data.id)
        selfID = data.id;
    for (var i = 0; i < data.player.length; i++) { new Player(data.player[i]); }
});

//Update
socket.on('update', function (data) {
    for (var i = 0; i < data.player.length; i++) {
        var pack = data.player[i];
        var p = Player.list[pack.id];

        if (p) {
            if (pack.x !== undefined)
                p.x = pack.x;
            if (pack.y !== undefined)
                p.y = pack.y;
            if (pack.Right !== undefined)
                p.Right = pack.Right;
            if (pack.Left !== undefined)
                p.Left = pack.Left;
            if (pack.Up !== undefined)
                p.Up = pack.Up;
            if (pack.Down !== undefined)
                p.Down = pack.Down;
            if (pack.map !== undefined)
                p.Map = pack.map;
            if (pack.Rota !== undefined)
                p.Rota = pack.Rota;
            //Update Roupas
            if (pack.roupa !== undefined)
                p.roupa = pack.roupa;
            if (pack.cabelo !== undefined)
                p.cabelo = pack.cabelo;
            if (pack.adicional !== undefined)
                p.adicional = pack.adicional;
            //Casa
            if (pack.layout !== undefined)
                p.layout = pack.layout;
            if (pack.parede !== undefined)
                p.parede = pack.parede;
            if (pack.piso !== undefined)
                p.piso = pack.piso;
            //Visitando
            if (pack.layoutVst !== undefined)
                p.layoutVst = pack.layoutVst;
            if (pack.paredeVst !== undefined)
                p.paredeVst = pack.paredeVst;
            if (pack.pisoVst !== undefined)
                p.pisoVst = pack.pisoVst;
        }
    }
});

//Remove
socket.on('remove', function (data) {
    for (var i = 0; i < data.player.length; i++) {
        delete Player.list[data.player[i]];
    }
});

//Loop  do canvas
setInterval(function () {
    if(!selfID){return;}

    ctx.clearRect(0, 0, ctxWidth, ctxHeight); //Limpa o canvas.
    Rotas();
    drawMap();
    GameLogic();
    for (var i in Player.list){Player.list[i].drawPlayer();}
        

}, 40);

//movimento jogador
document.onkeydown = function (event) {
    if (ChatInput === document.activeElement) {
        return;//Se o chat estiver em Foco impedir movimento
    }
    else if (event.keyCode === 68 || event.keyCode === 39) //D -ou- seta para direita
        socket.emit('keyPress', { inputId: 'right', state: true });
    else if (event.keyCode === 83 || event.keyCode === 40) //S -ou- seta para baixo
        socket.emit('keyPress', { inputId: 'down', state: true });
    else if (event.keyCode === 65 || event.keyCode === 37) //A -ou- seta para esquerda
        socket.emit('keyPress', { inputId: 'left', state: true });
    else if (event.keyCode === 87 || event.keyCode === 38) //W -ou- seta para cima
        socket.emit('keyPress', { inputId: 'up', state: true });
}
document.onkeyup = function (event) {
    if (event.keyCode === 68 || event.keyCode === 39) //D -ou- seta para direita
        socket.emit('keyPress', { inputId: 'right', state: false });
    else if (event.keyCode === 83 || event.keyCode === 40) //S -ou- seta para baixo
        socket.emit('keyPress', { inputId: 'down', state: false });
    else if (event.keyCode === 65 || event.keyCode === 37) //A -ou- seta para esquerda
        socket.emit('keyPress', { inputId: 'left', state: false });
    else if (event.keyCode === 87 || event.keyCode === 38) //W -ou- seta para cima
        socket.emit('keyPress', { inputId: 'up', state: false });
}
