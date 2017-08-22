/*
Minesweeper Game: Javascript                                                
Author: Nitish Kumar                                                                 

Usage:
 *
 *   MineSweeper.draw({
		container: 'minesweeper-ct', // container id
		grid: 5, // num of grid (n * n) = total number of box 
		noOfBombs: 5 // Number of boms
	});

*/

var MineSweeper = window.MineSweeper = {};

MineSweeper = (function() {
	var settings, parentDiv, childDiv, k, i, j, totalBox, container, bombs = [], 
	adjacentNumber = [], clickItem = [], done = false, cellClass = 'mine-sweeper-cell';

	function setDefaultValue (config) {
		settings = settings || {};
		settings.container = config.container || 'minesweeper-ct';
		settings.grid = config.grid || 10;
		settings.noOfBombs = config.noOfBombs || 10;
	
		totalBox = settings.grid * settings.grid;
		container = document.getElementById(settings.container);

	}

	function resetAllData () {
		bombs = [];
		adjacentNumber = [];
		clickItem = [];
		container.innerHTML = "";
		done = false;
	}

	function setElementHTML(id, value) {
			document.getElementById(id).innerHTML = value;
	}

	function setElementClickedClass(id) {
		document.getElementById(id).className = cellClass + ' mine-sweeper-clicked';
	}
	function setParantDivWidth () {
		var width = document.getElementsByClassName(cellClass)[0].offsetWidth;
		container.style.width = settings.grid * width + 'px';	
		container.className = 'mine-sweeper-table';	
			
	}

	function renderTemplate() {
		k = 1;
		for(i = 1; i <= settings.grid; i++) {
			parentDiv = document.createElement('div');
			parentDiv.className = "mine-sweeper-row";

			for(j = 1; j <= settings.grid; j++) {
				childDiv = document.createElement('div');
				childDiv.className = cellClass;
				childDiv.id = "cell-" + k;
				childDiv.setAttribute('data-value', k);
				parentDiv.appendChild(childDiv);
				k++;

			}	
			container.appendChild(parentDiv);
		}

		setParantDivWidth();
		

		/* Box Click */
		container.onclick = function (e) {
			var d = e.target.id, val = e.target.dataset.value, nonOpened;

			if(clickItem[val] == 0) {
				clickItem[val] = 1;
				
				if(done == false) {
					if(adjacentNumber[val] == "b") {
						for(var i = 0, l = bombs.length; i < l; i++) {
							setElementHTML('cell-' + bombs[i], "*");
						}
						done = true;
						var c = confirm("You Lose - Play Agian");
						if(c == true) {
							restart();
						}
					} else {
						if(adjacentNumber[val] == 0) {
								findNearestValue(val);
								setElementClickedClass('cell-' + val);
						} else {
							setElementHTML(d, adjacentNumber[val]);	
							setElementClickedClass('cell-' + val);
						}
						nonOpened = clickItem.filter(function (a) {
							return a == 0;
						});

						if(settings.noOfBombs == nonOpened.length) {
							for(var i = 0, l = bombs.length; i < l; i++) {
								setElementHTML('cell-' + bombs[i], "*");
							}
							done = true;
							alert('Congrates You Won :)');
						}
					}
				};
			}
		}	
	}

	/* Set Adjacent Number as 0 - Default*/
	function setAllBoxValueAsZero () {
		for(var i = 1; i <= settings.grid * settings.grid; i++) {
				adjacentNumber[i] = 0;	
				clickItem[i] = 0;
		}
	}

	/* Generate Unique Numbers */
	function renderUniqueNumber (n) {
		var arr = [], randomnumber, found, i;
		while(arr.length < n){
			 randomnumber = Math.ceil(Math.random() * settings.grid * settings.grid)
			 found = false;
		
			 for(i = 0; i< arr.length; i++){
				   if(arr[i] == randomnumber) {
				   		found = true;
				   		break
				   	}
			 }
			if( !found )
				arr[arr.length] = randomnumber;
		}
		return arr;
	}

	/* Generate Adjacent Number By Bomb */
	function generateAdjacentNumber (num) {
		var arr = [];
		if(num == 1) {
			arr.push(num + 1);
			arr.push(num + settings.grid);
			arr.push(num + settings.grid + 1);
		} else if(num == totalBox) {
			arr.push(num - settings.grid - 1);
			arr.push(num - settings.grid);
			arr.push(num - 1);
		} else if(num == settings.grid) {
			arr.push(num - 1);
			arr.push(num + settings.grid - 1);
			arr.push(num + settings.grid);
		} else if(num == (settings.grid * (settings.grid - 1) + 1)) {
			arr.push(num - settings.grid);
			arr.push(num - settings.grid + 1);
			arr.push(num + 1);
		} else if(num > 1 && num < settings.grid) {
			arr.push(num - 1);
			arr.push(num + 1);
			arr.push(num + settings.grid - 1);
			arr.push(num + settings.grid);
			arr.push(num + settings.grid + 1);
		} else if(num > (settings.grid * (settings.grid - 1)) && num < totalBox) {
			arr.push(num - settings.grid + 1);
			arr.push(num - settings.grid);
			arr.push(num - settings.grid - 1);
			arr.push(num - 1);
			arr.push(num + 1);
		}  else if(num > settings.grid && num < (settings.grid * (settings.grid - 1)) && (num % settings.grid == 1)) {
			arr.push(num - settings.grid);
			arr.push(num + settings.grid);
			arr.push(num - settings.grid + 1);
			arr.push(num + settings.grid + 1);
			arr.push(num + 1);
		} else if(num > settings.grid && num < (settings.grid * (settings.grid - 1)) && (num % settings.grid == 0)) {
			arr.push(num - settings.grid);
			arr.push(num + settings.grid);
			arr.push(num - settings.grid - 1);
			arr.push(num + settings.grid - 1);
			arr.push(num - 1);
		} else {
			arr.push(num - settings.grid + 1);
			arr.push(num - settings.grid);
			arr.push(num - settings.grid - 1);
			arr.push(num - 1);
			arr.push(num + 1);
			arr.push(num + settings.grid - 1);
			arr.push(num + settings.grid);
			arr.push(num + settings.grid + 1);
		}
		for(var i = 0, l = arr.length; i < l; i++) {
			adjacentNumber[arr[i]] += 1;
		}
	}

	/* Set Adjacent Number By Bombs */
	function setAdjacentNumberByBombs () {
		bombs = renderUniqueNumber(settings.noOfBombs);
		for(var i = 0; i < bombs.length; i++) {
			generateAdjacentNumber(bombs[i]);
		}
	}

	/* Set Bombs to Numbers */
	function setBombs () {
		for(var i = 0; i < bombs.length; i++) {
			adjacentNumber[bombs[i]] = 'b';
				
		}
	}

	function findFirstLeftValue (value) {

		var avg = Math.floor(value / settings.grid), i, minValue; 

		if(value % settings.grid == 0) {
			minValue = ((avg - 1) * settings.grid) + 1
		} else {
			minValue = ((avg) * settings.grid) + 1

		}	
		for(i = value; i >= minValue; i -= 1) {
			if(adjacentNumber[i] == 0) {
				setElementClickedClass('cell-' + i);
				clickItem[i] = 1;
			} else {
				if(i != 0) {
					setElementHTML('cell-' + i, adjacentNumber[i]);
					setElementClickedClass('cell-' + i);	
					clickItem[i] = 1;
				}
				break;
			}
		}
	}

	function findFirstRightValue (value) {
		var avg =  Math.ceil(value / settings.grid), i,
			maxValue = (avg * settings.grid); 

		for(i = value; i <= maxValue; i += 1) {
			if(adjacentNumber[i] == 0) {
				setElementClickedClass('cell-' + i);
				clickItem[i] = 1;	
			} else {
				if(i != 0) {
					setElementHTML('cell-' + i, adjacentNumber[i]);
					setElementClickedClass('cell-' + i);	
					clickItem[i] = 1;
				}
				
				break;
			}
		}
	}

	function findNearestValue (value) {
		var i, l = settings.grid * settings.grid;
		value = parseInt(value);	
		
		//To Top
		for(i = value; i > 1; i -= settings.grid) {
			if(adjacentNumber[i] == 0) {
				findFirstLeftValue(i);
				findFirstRightValue(i);
				
			} else {
				findFirstLeftValue(i);
				findFirstRightValue(i);
				break;
			}
		}

		//To Bottom
		for(i = value; i < l; i += settings.grid) {
			if(adjacentNumber[i] == 0) {
				findFirstLeftValue(i);
				findFirstRightValue(i);
				
			} else {
				findFirstLeftValue(i);
				findFirstRightValue(i);
				break;
			}
		}
	}

	function init(options) {
		setDefaultValue(options);
		start();	
	}

	function start() {
		renderTemplate();
		setAllBoxValueAsZero();
		setAdjacentNumberByBombs();
		setBombs();
	}

	function restart() {
		resetAllData();
		start();
	}
 
	return {
		draw: init,
		restart: restart 

	}
})();