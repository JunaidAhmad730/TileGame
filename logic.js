const size = 4;
        let board = Array(size).fill().map(() => Array(size).fill(0));

        function drawBoard() {
            const container = document.getElementById("game-container");
            container.innerHTML = "";
            board.forEach(row => {
                row.forEach(value => {
                    const tile = document.createElement("div");
                    tile.className = "tile";
                    tile.textContent = value || "";
                    tile.style.background = value ? "#eee4da" : "#cdc1b4";
                    container.appendChild(tile);
                });
            });
        }

        function addRandomTile() {
            let emptyTiles = [];
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if (board[r][c] === 0) emptyTiles.push({ r, c });
                }
            }
            if (emptyTiles.length > 0) {
                let { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
                board[r][c] = Math.random() < 0.9 ? 2 : 4;
            }
        }

        function move(direction) {
            let moved = false;
            if (direction === "left") {
                for (let r = 0; r < size; r++) {
                    let newRow = slideRow(board[r]);
                    if (JSON.stringify(board[r]) !== JSON.stringify(newRow)) moved = true;
                    board[r] = newRow;
                }
            } else if (direction === "right") {
                for (let r = 0; r < size; r++) {
                    let newRow = slideRow(board[r].reverse()).reverse();
                    if (JSON.stringify(board[r]) !== JSON.stringify(newRow)) moved = true;
                    board[r] = newRow;
                }
            } else if (direction === "up") {
                for (let c = 0; c < size; c++) {
                    let column = board.map(row => row[c]);
                    let newColumn = slideRow(column);
                    if (JSON.stringify(column) !== JSON.stringify(newColumn)) moved = true;
                    newColumn.forEach((val, r) => board[r][c] = val);
                }
            } else if (direction === "down") {
                for (let c = 0; c < size; c++) {
                    let column = board.map(row => row[c]).reverse();
                    let newColumn = slideRow(column).reverse();
                    if (JSON.stringify(column.reverse()) !== JSON.stringify(newColumn)) moved = true;
                    newColumn.forEach((val, r) => board[r][c] = val);
                }
            }
            if (moved) {
                addRandomTile();
                drawBoard();
            }
        }

        function slideRow(row) {
            let newRow = row.filter(v => v);
            for (let i = 0; i < newRow.length - 1; i++) {
                if (newRow[i] === newRow[i + 1]) {
                    newRow[i] *= 2;
                    newRow.splice(i + 1, 1);
                }
            }
            while (newRow.length < size) newRow.push(0);
            return newRow;
        }

        let startX, startY;

        document.getElementById("game-container").addEventListener("mousedown", event => {
            startX = event.clientX;
            startY = event.clientY;
        });

        document.getElementById("game-container").addEventListener("mouseup", event => {
            let diffX = event.clientX - startX;
            let diffY = event.clientY - startY;
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) move("right");
                else move("left");
            } else {
                if (diffY > 0) move("down");
                else move("up");
            }
        });

        addRandomTile();
        addRandomTile();
        drawBoard();