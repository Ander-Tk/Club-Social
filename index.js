//Configuração do Express
const express = require('express');
const app = express();
const http = require('http', { wsEngine: 'ws' });
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use('/Client', express.static(__dirname + '/Client'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Client/index.html');
});

server.listen(process.env.PORT || 3000, () => {
  console.log('Ok');
});

//Configuração do Banco Postgres
const {Pool} = require('pg');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

//Funções do Postgres
async function ValidPassword(data){//Verifica se a senha está correta
	try{
		await pool.connect()
		LoginQuery = await pool.query("select * from userlist WHERE username = $1 and senha = crypt($2, senha)", [data.username, data.password])
	}catch(err){
		console.log('erro: %d', err.stack)
		await pool.query("ROLLBACK")
	}finally{
		//await  pool.end()
		return LoginQuery
	}
} 

async function UsernameTaken(data){//Verifica se o  usuário está disponível
	try{
		await pool.connect();
		RegisterQuery = await pool.query('SELECT * FROM userlist WHERE username = $1', [data.username])
	}catch(err){
		console.log('erro: %d', err.stack)
		await pool.query("ROLLBACK")
	}finally{
		//await  pool.end()
		return RegisterQuery
	}
} 

async function addUser(data){//Adiciona usuário no banco de dados
	try{
		console.log(data)
		await pool.query("insert into userlist(username, senha, base, roupa, cabelo) values ($1, crypt($2, gen_salt('bf')), $3, $4, $5)", [data.username, data.password, data.base, data.roupa, data.cabelo])
	}catch(err){
		console.log('erro: %d', err.stack)
		await pool.query("ROLLBACK")
	}finally{
		//await  pool.end()
	}
} 

//Player
var Player = function(data){
	var self = {
		x: 400, y:240, 
		id:data.id,
		map:data.map,
		Rota:null,
		username:data.username,
		PlayerColor:data.PlayerColor,
		base:data.base,
		roupa:data.roupa,
		cabelo:data.cabelo,
		pressingRight:false,
		pressingLeft:false,
		pressingUp:false,
		pressingDown:false,
		Spd:5
	}
	self.updatePosition = function(){
		//Movimento
		if(self.pressingRight)
			self.x += self.Spd;
		if(self.pressingLeft)
			self.x -= self.Spd;
		if(self.pressingUp)
			self.y -= self.Spd;
		if(self.pressingDown)
			self.y += self.Spd;
		//Colisão do Canvas
		if(self.x < 4)
			self.x += self.Spd;
		if(self.x > 776)
			self.x -= self.Spd;
		if(self.y < 10)
			self.y += self.Spd;
		if(self.y > 440)
			self.y -= self.Spd;

		//Grid Geral.
		grid = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],];

		//Colisão Floresta
		if(self.map === 'Floresta'){

			var grid = [
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],];

			switch (self.GridPosition(self, grid)) {
				case 1:
					if(self.pressingRight)
						self.x -= self.Spd;
					if(self.pressingLeft)
						self.x += self.Spd;
					if(self.pressingUp)
						self.y += self.Spd;
					if(self.pressingDown)
						self.y -= self.Spd;
					break;
				case 5:
					self.Rota = 'RotaFloresta'
				  	break;
			}
		}

		//Colisão Floresta
		if(self.map === 'RotaFloresta'){
			
			var grid = [
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 6, 1, 1, 1, 1, 1, 1, 1],];

			switch (self.GridPosition(self, grid)) {
				case 1:
					if(self.pressingRight)
						self.x -= self.Spd;
					if(self.pressingLeft)
						self.x += self.Spd;
					if(self.pressingUp)
						self.y += self.Spd;
					if(self.pressingDown)
						self.y -= self.Spd;
					break;
				case 5:
					self.Rota = 'Floresta'
				  	break;
				case 6:
					self.Rota = 'Rota-Centro'
					break;
			}
		}

		//Colisão Centro
		if(self.map === 'Centro'){

			var grid = [
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
			[1, 1, 7, 1, 1, 1, 8, 8, 8, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 9, 1],
			[1, 1, 7, 1, 1, 1, 8, 8, 8, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 9, 1],
			[1, 1, 7, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 9, 1],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1],]

			switch (self.GridPosition(self, grid)) {
				case 1:
					if(self.pressingRight)
						self.x -= self.Spd;
					if(self.pressingLeft)
						self.x += self.Spd;
					if(self.pressingUp)
						self.y += self.Spd;
					if(self.pressingDown)
						self.y -= self.Spd;
					break;
				case 5:
					self.Rota = 'Centro-Praia' 
				  	break;
				case 6:
					self.Rota = 'Centro-Rota'
					break;
				case 7:
					self.Rota = 'Centro-Loja'
					break;
				case 8:
					self.Rota = 'Centro-Café'
					break;
				case 9:
					self.Rota = 'Centro-Escola'
					break;
			}
		}

		//Colisão café
		if(self.map === 'Cafe'){

			var grid = [
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1], 
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

			switch (self.GridPosition(self, grid)) {
				case 1:
					if(self.pressingRight)
						self.x -= self.Spd;
					if(self.pressingLeft)
						self.x += self.Spd;
					if(self.pressingUp)
						self.y += self.Spd;
					if(self.pressingDown)
						self.y -= self.Spd;
					break;
				case 5:
					self.Rota = 'Café-Centro'
				  	break;
			}
		}

		//Colisão Praia
		if(self.map === 'Praia'){

			var grid = [
			[0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1], 
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

			switch (self.GridPosition(self, grid)) {
				case 1:
					if(self.pressingRight)
						self.x -= self.Spd;
					if(self.pressingLeft)
						self.x += self.Spd;
					if(self.pressingUp)
						self.y += self.Spd;
					if(self.pressingDown)
						self.y -= self.Spd;
					break;
				case 5:
					self.Rota = 'Praia-Centro'
				  	break;
			}
		}

	}

	//Verifica colisão no grid
	self.GridPosition = function(self, grid){
		var gridX = Math.floor((self.x/16)/2);
		var gridY = Math.floor((self.y/16)/2);
		return grid[gridY][gridX]		
	}

	self.getInitPack = function(){//Retorna as características iniciais do player
		return{id:self.id, x:self.x, y:self.y, map:self.map, base:self.base, roupa:self.roupa, cabelo:self.cabelo, username:self.username}
	}
	self.getUpdatePack = function(){
		return{id:self.id, x:self.x, y:self.y, map:self.map, Rota:self.Rota,
			Right:self.pressingRight,
			Left:self.pressingLeft,
			Up:self.pressingUp,
			Down:self.pressingDown
		}
	}

	Player.list[self.id] = self;
	initPack.player.push(self.getInitPack());

	return  self;
}
Player.list = {};

//Temas Desenho
const Temas = ['Animais', 'Objetos', 'Verbos'];

const Animais = ['Jacaré', 'Gorila', 'Cobra', 'Capivara', 'Tartaruga', 'Girafa', 'Elefante', 'Pelicano', 'Tigre', 'Zebra'];
const Objetos = ['Apagador', 'Bandeira', 'Computador', 'Estátua', 'Fantoche', 'Grampeador', 'Guarda-chuva', 'Lanterna', 'Mochila', 'Mouse', 'OVNI', 'Termômetro', 'Violino', 'Piano', 'Pêndulo'];
const Verbos = ['Comer', 'Falar', 'Cantar', 'Correr', 'Comprar', 'Lutar', 'Empurrar', 'Pensar'];

//Histórico dos desenhos
let history = [];
//Lista Players
var ListaDesenhando = [];
//Pintor Escolhido
var Pintor = null;
//PalavraChave e  chute;
var PalavraChave = null;
var ChutePalavra = null;
//Executar apenas uma vez
var run_once = 0;
// Contador (segundos)
var TempoDesenho = 120; // 2 minutos para desenhar
// ID para o setTimeout
var TimeID = null;

//Funções do Player
Player.onConnect = function(socket, base, roupa, cabelo, username, map){
	var map = 'Centro';
	socket.join(map);

	const PlayerColor = Math.floor(Math.random()*16777215).toString(16);

	var player = Player({
		id:socket.id, 
		base:base, roupa:roupa, cabelo:cabelo, 
		username:username, 
		map:map,
		PlayerColor:PlayerColor,
	}); //Cria um novo player com as características informadas.

	//Atualiza o  mapa do jogador
	socket.on('changeMap', function(data){
		socket.leave(data.OldMap);
		socket.join(data.Mapa);
		player.map = data.Mapa;

		if(data.PosX)
			player.x = data.PosX;
		if(data.PosY)
			player.y = data.PosY;
	});
	//Rota
	socket.on('Rota', function(){
		player.Rota = null;
	})

	//Input de movimento
	socket.on('keyPress',function(data){
		if(data.inputId === 'left')
			player.pressingLeft = data.state;		
		else if(data.inputId === 'right')		
			player.pressingRight = data.state;		
		else if(data.inputId === 'up')		
			player.pressingUp = data.state;		
		else if(data.inputId === 'down')		
			player.pressingDown = data.state;	
	});

	//Carrega  todos os jogaderes em todas as  instancias.
	socket.emit('init', {
		id:socket.id,
		player:Player.getAllPack(),
	})

	socket.on('MsgToServer', function(data, SenderID, Map){
		if(Map ===  'Desenho'){
			if(SenderID === Pintor){return;}
			ChutePalavra = data.charAt(0).toUpperCase()+ data.slice(1);
			GanhadorDesenho(ChutePalavra, SenderID, Player.list[SenderID].PlayerColor);
		}
		else{
		io.to(Map).emit('ToChat', data, SenderID, Player.list[SenderID].PlayerColor)//Envia mensagem apenas no mapa selecionado
	  }
	})

	//Lista de jogadores desenhando + Lógica pintor.
	socket.on('JogadoresDesenhando', function(data){
		if(run_once == 0){
			socket.broadcast.emit('clear') // Apaga o ultimo desenho + Mensagem;
			//Lista de players.
			ListaDesenhando =  data;

			TemaDesenho = Temas[Math.floor(Math.random()*Temas.length)];
			switch (TemaDesenho) {
				case 'Animais':
					PalavraChave = Animais[Math.floor(Math.random()*Animais.length)];
					break;
				case 'Objetos':
					PalavraChave = Objetos[Math.floor(Math.random()*Objetos.length)];
					break;
				case 'Verbos':
					PalavraChave = Verbos[Math.floor(Math.random()*Verbos.length)];
					break;
			}
			
			//Seleciona um Pintor dentre os jogadores presentes.
			Pintor = ListaDesenhando[Math.floor(Math.random()*ListaDesenhando.length)];
			io.to('Desenho').emit('Pintor', Pintor, PalavraChave, TemaDesenho) //Dados da partida.

			// Reduz o tempo cada segundo
			TimeID = setInterval(function() {
				TempoDesenho--;
				// Finaliza o jogo quando o tempo acabar
				if (TempoDesenho <= 0) {
					TempoEsgotado();
				}
			}, 1000)

			//Executado
			run_once = 1;
		}
		//Lista de Jogadores na sala [Atualiza durante o loop]
		ListaAlternativa = data;

		if(ListaAlternativa.length != ListaDesenhando.length){
			if(ListaAlternativa.includes(Pintor)){
				return;
			}else{
				TempoDesenho = 125;
				clearInterval(TimeID);
				run_once = 0;
			}
		}
	})

	//Verifica Quantidade Player < 2 [Reseta o Game]
	socket.on('AtualizaLista', function(data){
		if(data.length <2){
			TempoDesenho = 125;
			clearInterval(TimeID);
			run_once = 0;
		}
	})
	
	//Tempo Esgotado
	function TempoEsgotado(){
		TempoDesenho = 125;
		io.to('Desenho').emit('clear')
		io.to('Desenho').emit('TempoEsgotado')
		setTimeout(function() {
			io.to('Desenho').emit('clear')
			clearInterval(TimeID);
			run_once = 0;
		}, 5000)
	}

	//Acertar Desenho
	function GanhadorDesenho(ChutePalavra, SenderID, PlayerColor){
		TempoDesenho = 125;
		if(ChutePalavra === PalavraChave){
			io.to('Desenho').emit('clear')
			io.to('Desenho').emit('GanhadorDesenho', SenderID, PlayerColor)
			setTimeout(function() {
				io.to('Desenho').emit('clear')
				clearInterval(TimeID);
				run_once = 0;
			}, 5000)
		}
	}

	//Para cada desenho no histórico enviar aos novos players no mapa Desenho
	if(player.map === 'Desenho'){
		history.forEach(data => socket.emit('Desenhando', data))
	}

	socket.on('clear', function(){//Apaga o canvas
		history = new Array()
		socket.to('Desenho').emit('clear')
	})

	//Desenha no canvas
	socket.on('Desenhando', function(data){
		history.push(data)
		socket.broadcast.emit('Desenhando', data);
	})

}

Player.getAllPack = function(){
	var players = [];
	for(var i in Player.list)
		players.push(Player.list[i].getInitPack());
	return players;
}

Player.onDisconnect = function(socket){
	delete Player.list[socket.id];
	removePack.player.push(socket.id);
}

Player.update = function(socket){
	var pack = [];
		for(var i in Player.list){
			var player = Player.list[i];
			player.updatePosition();
			pack.push(player.getUpdatePack());
		} return pack;
}

//Lista de Sockets.
var SOCKET_LIST = {};
//Conexões socket.
io.on('connection', (socket) => {
  console.log('Connected');
  socket.id = socket.id;
  SOCKET_LIST[socket.id] = socket;
	//Fazer login
  	socket.on('Login',function(data){
		var res = ValidPassword(data)
		res.then(res => {
			if(res.rows[0] != undefined){
				Player.onConnect(socket, res.rows[0].base, res.rows[0].roupa, res.rows[0].cabelo, res.rows[0].username);
				socket.emit('LoginResp',{success:true});
			}
			else{
				socket.emit('LoginResp',{success:false});
			}
		})	
	});
	//Criar conta
	socket.on('Registro',function(data){
		var res = UsernameTaken(data)
		res.then(res => {
			if(res.rows[0] != undefined){
				socket.emit('RegistroResp',{success:false});  
			}
			else{
				addUser(data)
				socket.emit('RegistroResp',{success:true});
			}
		})	
	});
  
  //Player.onConnect(socket);
  socket.on('disconnect', function(){
  	delete SOCKET_LIST[socket.id];
  	Player.onDisconnect(socket);
  });
});

var initPack = {player:[]};
var removePack = {player:[]};


setInterval(function(){
	var pack = {player:Player.update()}

	for(var i in  SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('init', initPack);
		socket.emit('update', pack);
		socket.emit('remove', removePack);
	}
	initPack.player = [];
	removePack.player = [];

},1000/25);
