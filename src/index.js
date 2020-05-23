import Board from "./board";
import Tile from "./tile";
const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 800;
const BOARD_SIZE = 4;
const TILE_SIZE = BOARD_WIDTH / BOARD_SIZE;
console.clear();
let board = new Board(BOARD_WIDTH, BOARD_HEIGHT, BOARD_SIZE);
board.setup();
