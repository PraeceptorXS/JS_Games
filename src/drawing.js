export function drawBG(boardSize, tileSize) {
	let background = document.getElementsByClassName("Background");
	for (let r = 0; r < boardSize; r++) {
		for (let c = 0; c < boardSize; c++) {
			let elem = document.createElement("div");
			elem.setAttribute("class", "BGTile");
			elem.style.top = r * tileSize + 10 + 5 + "px";
			elem.style.left = c * tileSize + 10 + 5 + "px";
			background[0].appendChild(elem);
		}
	}
}
