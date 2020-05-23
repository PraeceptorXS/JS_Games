export class inputHandler {
	constructor(board) {
		let enableCall = true;
		document.addEventListener("keydown", event => {
			if (!enableCall) return;
			enableCall = false;
			switch (event.keyCode) {
				case 69: //e
					board.moveUp();
					break;
				case 83: //s
					board.moveLeft();
					break;
				case 68: // d
					board.moveDown();
					break;
				case 70: //fe
					board.moveRight();
					break;
				default:
			}
			board.move();
			setTimeout(() => (enableCall = true), 250);
		});
	}
}
