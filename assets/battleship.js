const player1 = {
	shipLoc: [],
	score: 0,
	totalWin: 0
}

const player2 = {
	shipLoc: [],
	score: 0,
	totalWin: 0
}

let gameSetup = {
	markedLoc: [],
	attackLoc: [],
	startGame: false,
	p1Turn: false,
	p2Turn: false
}

function markLoc(id) {
    document.getElementById(id).setAttribute("class", "box markLoc no-hover");
}

function attackedLoc(id) {
	document.getElementById(id).setAttribute("class", "box attackedLoc no-hover");	
}

function attackSucceedLoc(id) {
	document.getElementById(id).setAttribute("class", "box attackSucceedLoc no-hover");	
}

function suicideLoc(id) {
	document.getElementById(id).setAttribute("class", "box suicideLoc no-hover");
}

function removeLastLoc(id) {
	const lastLoc = id[id.length-1];
	document.getElementById(lastLoc).setAttribute("class", "box");
}

function removeAllLoc() {
	if (gameSetup.markedLoc.length == 0) {
		return;
	}
	else {
		for (let mark of gameSetup.markedLoc) {
			document.getElementById(mark).setAttribute("class", "box");
		}
	}
}

function playerSetup(id) {
	if (gameSetup.markedLoc.length == 3) {
		if (id === 'p1_button') {
			player1.shipLoc = gameSetup.markedLoc;
			console.log(player1.shipLoc);

			// menentukan turn awal
			if (gameSetup.p2Turn == false) {
				gameSetup.p1Turn = true;
			}
		}
		else if (id === 'p2_button') {
			player2.shipLoc = gameSetup.markedLoc;
			console.log(player2.shipLoc);

			// menentukan turn awal
			if (gameSetup.p1Turn == false) {
				gameSetup.p2Turn = true;
			}
		}
		
		removeAllLoc();
		gameSetup.markedLoc = [];
		document.getElementById(id).disabled = true;
	}
	else {
		alert("Tentukan 3 lokasi kapal!");
	}

	console.log("Player 1 turn:" + gameSetup.p1Turn);
	console.log("Player 2 turn:" + gameSetup.p2Turn);
}

function startGame() {
	// validasi jika lokasi kapal sudah di set
	if (player1.shipLoc.length == 3 && player2.shipLoc.length == 3) {
		gameSetup.startGame = true;
		document.getElementById('start_button').disabled = true;
		removeAllLoc();
	}
	else if (player1.shipLoc.length < 3) {
		alert("Lokasi kapal player 1 belum di set!");
	}
	else if (player2.shipLoc.length < 3) {
		alert("Lokasi kapal player 2 belum di set!");
	}
	else {
		alert("Lokasi kapal belum di set!");
	}

	displayTurn();
}

function resetGame() {
	// reset object properties
	gameSetup.markedLoc= [];
	gameSetup.attackLoc = [];
	gameSetup.startGame = false;
	gameSetup.p1Turn = false;
	gameSetup.p2Turn = false;

	player1.shipLoc = [];
	player1.score = 0;
	player1.totalWin = 0;

	player2.shipLoc = [];
	player2.score = 0;
	player2.totalWin = 0;

	// reset display properties
	document.getElementById('start_button').disabled = false;
	document.getElementById('p1_button').disabled = false;
	document.getElementById('p2_button').disabled = false;
	document.getElementById('battleship').setAttribute("class", "flex-container-column-bs basis-60");
	document.getElementById('p1turn').innerText = "";
	document.getElementById('p2turn').innerText = "";
	document.getElementById('p1scoreboard').innerText = "0";
	document.getElementById('p2scoreboard').innerText = "0";

	const boxes = document.getElementsByClassName('box');
	for (let box of boxes) {
		box.setAttribute('class', 'box');
	}
}

function changeTurn() {
	if (gameSetup.p1Turn == true) {
		gameSetup.p1Turn = false;
		gameSetup.p2Turn = true;
	}
	else if (gameSetup.p2Turn == true) {
		gameSetup.p1Turn = true;
		gameSetup.p2Turn = false;
	}
}

function displayTurn() {
	const disp = "YOUR TURN";
	if (gameSetup.p1Turn) {
		document.getElementById('p1turn').innerText = disp;
		document.getElementById('p2turn').innerText = "";
	}
	else {
		document.getElementById('p2turn').innerText = disp;
		document.getElementById('p1turn').innerText = "";
	}
}

function destroyShip(id) {
	if (player1.shipLoc.includes(id)) {
		let index = player1.shipLoc.indexOf(id);
		player1.shipLoc.splice(index,1);
	}
	if (player2.shipLoc.includes(id)) {
		let index = player2.shipLoc.indexOf(id);
		player2.shipLoc.splice(index,1);
	}
}

function checkWWinLose() {
	if (player1.shipLoc.length == 0 || player2.shipLoc.length == 0) {
		let historyData = {
			p1win: "",
			score: "",
			p2win: ""
		};

		const win = "WINNER!!!!";
		if (player1.shipLoc.length > player2.shipLoc.length) {
			player1.totalWin += 1;
			setTimeout(function() {
				alert("GAME OVER. PLAYER 1 WIN!");
				document.getElementById('p1turn').innerText = win;
			},100)
			historyData.p1win = "WIN";
		}
		else if (player2.shipLoc.length > player1.shipLoc.length) {
			player2.totalWin += 1;
			setTimeout(function() {
				alert("GAME OVER. PLAYER 2 WIN!");
				document.getElementById('p2turn').innerText = win;
			},100)
			historyData.p2win = "WIN";
		}
		else {
			document.getElementById('p1turn').innerText = "DRAW"
			document.getElementById('p2turn').innerText = "DRAW"
			setTimeout(function() {
				alert("GAME OVER. DRAW!");
			},100)
			historyData.p1win = "DRAW";
			historyData.p2win = "DRAW";
		}
		// disabled board
		let board = document.getElementById('battleship');
		board.classList.add("no-hover");

		// set start game = false
		gameSetup.startGame = false;

		// check negative
		if (player1.score < 0) {

		}
		historyData.score = `${player1.score} | ${player2.score}`;
		// record history
		putHistory(historyData);
		renderHistory();
	}
	else {
		changeTurn()
		displayTurn();;
	}
}

function checkAttack(id) {
	if (gameSetup.p1Turn) {
		// cek ship musuh
		for (let ship of player2.shipLoc) {
			console.log("ship: " + ship);
			if (id === ship) {
				player1.score += 1;
				attackSucceedLoc(id);
			}
		}
		// cek ship sendiri
		for (let ship of player1.shipLoc) {
			if (id === ship) {
				player1.score -= 1;
				suicideLoc(id);
			}
		}
	}
	else if (gameSetup.p2Turn) {
		for (let ship of player1.shipLoc) {
			console.log("ship: " + ship);
			if (id === ship) {
				player2.score += 1;
				attackSucceedLoc(id);
			}
		}
		// cek ship sendiri
		for (let ship of player2.shipLoc) {
			if (id === ship) {
				player2.score -= 1;
				suicideLoc(id);
			}
		}
	}

	// update scoreboard
	updateScore(id);
	// hapus ship location
	destroyShip(id);
	// check win lose
	checkWWinLose();
	console.log("p1 score: " + player1.score);
	console.log("p2 score: " + player2.score);
}

function updateScore(id) {
	if (gameSetup.p1Turn) {
		document.querySelector('#p1scoreboard').innerText = player1.score.toString();
	}
	if (gameSetup.p2Turn) {
		document.querySelector('#p2scoreboard').innerText = player2.score.toString();
	}
}

const boxes = document.querySelectorAll('.box');

for (let box of boxes) {
    box.addEventListener('click', function(event) {
        const target = event.target;
        
        if (target.classList.contains('box')) {
        	// check jika game belum di start, maka dalan tahap mark lokasi setiap player
        	if (gameSetup.startGame == false) {
	            let id = target.id;
	            gameSetup.markedLoc.unshift(id)

	            if (gameSetup.markedLoc.length > 3) {
	            	removeLastLoc(gameSetup.markedLoc);
	            	gameSetup.markedLoc.pop();
	            }
	            markLoc(id);
	            return;
	        }
	        // game started
	        else {
        		// check win lose
				if (gameSetup.startGame == true) {
					attackedLoc(target.id);
					checkAttack(target.id);
				};

        		console.log("P1 TURN: " + gameSetup.p1Turn);
        		console.log("P2 TURN: " + gameSetup.p2Turn);
        		console.log(target.id);
	        }
    	}
    });
}

const buttons = document.querySelectorAll('.button');

for (let button of buttons) {
	button.addEventListener('click', function(event) {
		const target = event.target;

		console.log(target.id);

		if (target.id === 'start_button') {
			startGame();
			return;
		}

		if (target.id === 'p1_button' || target.id === 'p2_button') {
			playerSetup(target.id);
			return;
		}

		if (target.id === 'reset_button') {
			resetGame();
			return;
		}
	});
}