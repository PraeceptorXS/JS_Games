import Tile from "./tile";
import { inputHandler } from "./eventHandler";
import { drawBG } from "./drawing";
import anime from "animejs";
export default class Board {
	constructor(boardWidth, boardHeight, boardSize) {
		new inputHandler(this);
		this.boardWidth = boardWidth;
		this.boardHeight = boardHeight;
		this.boardSize = boardSize;
		this.board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
		this.tiles = [];
		this.tileSize = boardWidth / boardSize;
		this.moves = [];
		this.score = 0;
	}
	setup() {
		drawBG(this.boardSize, this.tileSize);
		this.populateTiles();
		this.populateBoard();
		this.drawTiles();
		this.printBoard();
	}
	populateBoard() {
		this.getRandEmptyCellAndPopulate();
		this.getRandEmptyCellAndPopulate();
	}
	populateTiles() {
		this.board.forEach((row, rowNum) => {
			let tempRow = [];
			row.forEach((value, colNum) => {
				tempRow.push(new Tile(colNum, rowNum, this.tileSize, value));
			});
			this.tiles.push(tempRow);
		});
	}
	updateScore() {}
	printBoard() {
		let str = "";
		this.board.forEach((row, rowNum) => {
			row.forEach((value, colNum) => {
				str += value + "\t";
			});
			row.forEach((value, colNum) => {
				str += "|" + this.tiles[rowNum][colNum].value + "\t";
			});
			str += "\n";
		});
		console.log(str);
		let display = document.getElementsByClassName("Tile");
		console.log(display.length);
	}
	getRandEmptyCellAndPopulate(r, c) {
		if (typeof r !== "undefined") {
			this.board[r][c] = 2;
			this.tiles[r][c] = new Tile(c, r, this.tileSize, 2);
			return;
		}
		let spaces = [];
		this.board.forEach((row, rownum) => {
			row.forEach((col, colnum) => {
				let testValue = this.board[rownum][colnum];
				if (testValue === 0) {
					spaces.push({ r: rownum, c: colnum });
				}
			});
		});
		if (spaces.length === 0) {
			return;
		}
		let point = spaces[Math.floor(Math.random() * spaces.length)];
		let temp = Math.random() < 0.9 ? 2 : 4;
		this.board[point.r][point.c] = temp;
		this.tiles[point.r][point.c].value = temp;
		return point;
	}
	drawTiles() {
		this.tiles.forEach((row, rowNum) => {
			row.forEach((tile, colNum) => {
				tile.draw();
			});
		});
	}
	move() {
		let board = this.board;
		let tiles = this.tiles;
		let currObj = this;
		let expand = [];
		function updateTiles() {
			let newTile = currObj.getRandEmptyCellAndPopulate();
			let str = "";
			board.forEach((row, rowNum) => {
				row.forEach((value, colNum) => {
					tiles[rowNum][colNum].value = value;
					tiles[rowNum][colNum].draw();
					str += value + "\t";
				});
				str += "\n";
			});
			let timeline = anime
				.timeline({
					duration: 200,
					easing: "easeInOutSine"
				})
				.add(
					{
						targets: currObj.tiles[newTile.r][newTile.c].tile,
						scale: [0, 1],
						duration: "100",
						easing: "linear"
					},
					"0"
				);
			console.log(str);
			expand.forEach(pair => {
				timeline.add(
					{
						targets: tiles[pair.r][pair.c].tile,
						duration: "120",
						scale: [1, 1.1, 1]
					},
					"0"
				);
			});
		}
		const timeline = anime.timeline({
			duration: 0,
			easing: "easeInOutSine",
			complete: function() {
				this.reset();
				updateTiles();
			}
		});
		this.moves.forEach(move => {
			this.moveTo(move, timeline);
			if (move.merged) {
				expand.push(move);
			}
		});
		this.moves = [];
	}
	moveTo({ fromR, fromC, r, c, merged }, timeline) {
		let currX = this.tiles[fromR][fromC].x + 5;
		let currY = this.tiles[fromR][fromC].y + 5;
		let newX = c * this.tileSize + 15;
		let newY = r * this.tileSize + 15;
		let diffX = newX - currX;
		let diffY = newY - currY;
		timeline.add(
			{
				targets: this.tiles[fromR][fromC].tile,
				translateX: diffX,
				translateY: diffY,
				duration: "125"
			},
			"0"
		);
	}
	moveUp() {
		for (let c = 0; c < this.board.length; c++) {
			for (let r = 0; r < this.board.length; r++) {
				let newThisRC = { r: r, c: c };
				let newAltRC = { r: -1, c: c };
				let altPos = { r: -1, c: c };
				let tile = this.board[r][c];
				let merged = false;
				if (tile === 0) {
					continue;
				}
				for (let i = 1; i + r < this.board.length; i++) {
					let cmpTile = this.board[r + i][c];
					if (cmpTile !== tile && cmpTile !== 0) {
						break;
					}
					if (tile === cmpTile) {
						this.board[r][c] *= 2;
						newAltRC.value = 0;
						altPos.r = r + i;
						newAltRC.r = r;
						merged = true;
						this.board[r + i][c] = 0;
						break;
					}
				}
				let slide = 0;
				for (let j = 1; r - j >= 0 && this.board[r - j][c] === 0; j++) {
					slide = j;
				}
				if (slide !== 0) {
					tile = this.board[r][c];
					this.board[r][c] = 0;
					newThisRC.r = r - slide;
					newAltRC.r = r - slide;
					this.board[r - slide][c] = tile;
				}
				if (altPos.r !== -1 && newAltRC.r !== -1) {
					this.moves.push({
						fromR: altPos.r,
						fromC: altPos.c,
						r: newAltRC.r,
						c: newAltRC.c,
						merged: merged
					});
				}
				if (r !== newThisRC.r) {
					this.moves.push({
						fromR: r,
						fromC: c,
						r: newThisRC.r,
						c: newThisRC.c,
						merged: false
					});
				}
			}
		}
	}
	moveDown() {
		for (let c = 0; c < this.board.length; c++) {
			for (let r = this.board.length - 1; r >= 0; r--) {
				let newThisRC = { r: r, c: c, value: this.board[r][c] };
				let newAltRC = { r: -1, c: c, value: 0 };
				let altPos = { r: -1, c: c };
				let tile = this.board[r][c];
				let merged = false;
				if (tile === 0) {
					continue;
				}
				for (let i = 1; r - i >= 0; i++) {
					let cmpTile = this.board[r - i][c];
					if (cmpTile !== tile && cmpTile !== 0) {
						break;
					}
					if (tile !== 0 && tile === cmpTile) {
						this.board[r][c] *= 2;
						newAltRC.value = 0;
						newThisRC.value *= 2;
						altPos.r = r - i;
						newAltRC.r = r;
						this.board[r - i][c] = 0;
						merged = true;
						break;
					}
				}
				let slide = 0;
				for (
					let j = 1;
					r + j < this.board.length && this.board[r + j][c] === 0;
					j++
				) {
					slide = j;
				}
				if (slide !== 0) {
					tile = this.board[r][c];
					this.board[r][c] = 0;
					newThisRC.r = r + slide;
					newAltRC.r = r + slide;
					this.board[r + slide][c] = tile;
				}
				if (altPos.r !== -1 && newAltRC.r !== -1) {
					this.moves.push({
						fromR: altPos.r,
						fromC: altPos.c,
						r: newAltRC.r,
						c: newAltRC.c,
						merged: merged
					});
				}
				if (r !== newThisRC.r) {
					this.moves.push({
						fromR: r,
						fromC: c,
						r: newThisRC.r,
						c: newThisRC.c,
						merged: merged
					});
				}
			}
		}
	}
	moveLeft() {
		for (let r = 0; r < this.board.length; r++) {
			for (let c = 0; c < this.board.length; c++) {
				let newThisRC = { r: r, c: c };
				let newAltRC = { r: r, c: -1 };
				let altPos = { r: r, c: -1 };
				let tile = this.board[r][c];
				let merged = false;
				if (tile === 0) {
					continue;
				}
				for (let i = 1; i + c < this.board.length; i++) {
					let cmpTile = this.board[r][i + c];
					if (cmpTile !== tile && cmpTile !== 0) {
						break;
					}
					if (tile === cmpTile) {
						this.board[r][c] *= 2;
						newAltRC.value = 0;
						altPos.c = c + i;
						newAltRC.c = c;
						merged = true;
						this.board[r][c + i] = 0;
						break;
					}
				}
				let slide = 0;
				for (let j = 1; c - j >= 0 && this.board[r][c - j] === 0; j++) {
					slide = j;
				}
				if (slide !== 0) {
					tile = this.board[r][c];
					this.board[r][c] = 0;
					newThisRC.c = c - slide;
					newAltRC.c = c - slide;
					this.board[r][c - slide] = tile;
				}
				if (altPos.c !== -1 && newAltRC.c !== -1) {
					this.moves.push({
						fromR: altPos.r,
						fromC: altPos.c,
						r: newAltRC.r,
						c: newAltRC.c,
						merged: merged
					});
				}
				if (c !== newThisRC.c) {
					this.moves.push({
						fromR: r,
						fromC: c,
						r: newThisRC.r,
						c: newThisRC.c,
						merged: merged
					});
				}
			}
		}
	}
	moveRight() {
		for (let r = 0; r < this.board.length; r++) {
			for (let c = this.board.length; c >= 0; c--) {
				let newThisRC = { r: r, c: c };
				let newAltRC = { r: r, c: -1 };
				let altPos = { r: r, c: -1 };
				let tile = this.board[r][c];
				let merged = false;
				if (tile === 0) {
					continue;
				}
				for (let i = 1; c - i >= 0; i++) {
					let cmpTile = this.board[r][c - i];
					if (cmpTile !== tile && cmpTile !== 0) {
						break;
					}
					if (tile === cmpTile) {
						this.board[r][c] *= 2;
						newAltRC.value = 0;
						altPos.c = c - i;
						newAltRC.c = c;
						this.board[r][c - i] = 0;
						merged = true;
						break;
					}
				}
				let slide = 0;
				for (
					let j = 1;
					c + j < this.board.length && this.board[r][c + j] === 0;
					j++
				) {
					slide = j;
				}
				if (slide !== 0) {
					tile = this.board[r][c];
					this.board[r][c] = 0;
					newThisRC.c = c + slide;
					newAltRC.c = c + slide;
					this.board[r][c + slide] = tile;
				}
				if (altPos.c !== -1 && newAltRC.c !== -1) {
					this.moves.push({
						fromR: altPos.r,
						fromC: altPos.c,
						r: newAltRC.r,
						c: newAltRC.c,
						merged: merged
					});
				}
				if (c !== newThisRC.c) {
					this.moves.push({
						fromR: r,
						fromC: c,
						r: newThisRC.r,
						c: newThisRC.c,
						merged: merged
					});
				}
			}
		}
	}
}
