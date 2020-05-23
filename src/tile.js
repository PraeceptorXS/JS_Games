import anime from "animejs";

export default class Tile {
	constructor(xpos, ypos, size, value) {
		this.x = xpos * size + 10;
		this.y = ypos * size + 10;
		this.value = value;
		this.size = size;
		this.board = document.getElementsByClassName("Board")[0];
		this.tile = document.createElement("div");
		this.tile.setAttribute("class", "Tile");
		this.board.appendChild(this.tile);
	}
	draw() {
		let fill = "#000";
		switch (this.value) {
			case 0:
				fill = "#ccc0b4";
				break;
			case 2:
				fill = "#ede3d9";
				break;
			case 4:
				fill = "#eedfc8";
				break;
			case 8:
				fill = "#f2b179";
				break;
			case 16:
				fill = "#ec8d53";
				break;
			case 32:
				fill = "#f57c5f";
				break;
			case 64:
				fill = "#f65d3b";
				break;
			case 128:
				fill = "#edce71";
				break;
			case 256:
				fill = "#eccb60";
				break;
			case 512:
				fill = "#eec750";
				break;
			case 1024:
				fill = "#ecc43e";
				break;
			case 2048:
				fill = "#edc12d";
				break;
			default:
				fill = "#3d3a33";
		}
		this.tile.style.background = fill;
		this.tile.textContent = this.value;
		if (this.value !== 0) {
			fill = "#766e65";
			if (this.value > 4) {
				fill = "#fdfdfe";
			}
		}
		if (this.value === 0) {
			this.tile.style.opacity = 0;
		} else {
			this.tile.style.opacity = 1;
		}
		this.tile.style.top = this.y + 5 + "px";
		this.tile.style.left = this.x + 5 + "px";
		this.tile.style.color = fill;
		this.tile.style.fontSize =
			this.value > 1000 ? "50px" : this.value > 100 ? "65px" : "80px";
	}
}
