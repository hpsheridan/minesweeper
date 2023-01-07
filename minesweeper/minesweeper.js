/* Haley Psomas-Sheridan    *
 * CS 370, Fall 2019        *
 * minesweeper.js           */


function appendMineToSelection(selection) {

    var mine_circle_radius = 8;
    var mine_size = 5;

    selection.append('circle')
        .filter(d => d.is_mine_cell == true)
        .attr('r', mine_circle_radius)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('fill', 'black')
        .attr('transform', 'translate(20, 20)');

    //draw 4 lines, rotate each, and center in the mine cell
    d3.range(4).forEach((d, i) =>
        selection.append('line')
            .filter(d => d.is_mine_cell == true)
            .attr('x1', -(mine_circle_radius + mine_size))
            .attr('y1', 0)
            .attr('x2', mine_circle_radius + mine_size)
            .attr('y2', 0)
            .attr('stroke-width', 3)
            .attr('stroke', 'black')
            .attr('transform', `translate(20, 20) rotate(${i * 45})`)
    );
    selection.append('rect')
        .filter(d => d.is_mine_cell == true)
        .attr('width', 2)
        .attr('height', 2)
        .attr('fill', 'white')
        .attr('transform', 'translate(16, 16)');
}


function createTimer(width) {
    let minutes = 0, seconds = 0;
    // place the digits of the timer in the item whose
    // class-name is main-svg.

    const clock = d3.select('.main-svg').append('g')
        .attr('class', 'clock')
        .attr('transform', `translate(${width / 2}, 30)`)
        .attr("transform", "translate(70,30)")
        .append('text')
        .attr('class', 'clock-text')
        .attr('text-anchor', 'middle')
        .attr('font-size', 40)
        .attr('stroke', 'black')
        .attr('fill', 'black');

    function updateClock(clock, minutes, seconds) {
        // format the timer's text.
        clock.text(`${d3.format("02d")(minutes)}:${d3.format('02d')(seconds)}`);
    }

    updateClock(clock, 0, 0);  // display 0:0
    return function () {
        return d3.interval(() => {
            // Every second, add one to the seconds variable,
            // update the minute variable if necessary, and
            // update the text of the timer.
            seconds += 1;
            minutes += Math.floor(seconds / 60);
            seconds %= 60;
            updateClock(clock, minutes, seconds);
        }, 1000);
    };
}

function timerDemo() {
    d3.select('body').append('svg').attr('width', 300).attr('height', 200);//.attr('class', 'svg');
    const timerFunction = createTimer(300);  // create and display the timer (doesn't start the timer.)
    myTimer = timerFunction(); // start the timer.

}

function createConfigurationParameters(numRows, numColumns) {
    const configAttributes = { //variable names configAttributes
        svg_width: 800,
        svg_height: 800,
        margins: {
            left: 20,
            right: 20,
            top: 50,
            bottom: 30
        },
        svg_margins: {
            top: 100,
            left: 100
        },
        board_cell_size: 40, //40
        board_cell_gap: 5,
        board_cell_stroke: 'steelblue',
        board_cell_fill: 'grey',
        main_board_stroke: 'black',
        mine_circle_radius: 8,
        mine_size: 5,
    };

    configAttributes['svg_width'] = configAttributes.margins.left + configAttributes.margins.right +
        (configAttributes.board_cell_size + configAttributes.board_cell_gap) * numRows;
    configAttributes['svg_height'] = configAttributes.margins.top + configAttributes.margins.bottom +
        (configAttributes.board_cell_size + configAttributes.board_cell_gap) * numColumns;

    return configAttributes;
}


function playMinesweeper(rows, columns, percentageOfMines) {
    var numUnopened = 100; //number of cells on the board
    var inPlay = false; //has the board been clicked yet?
    // create a two dimensional array with "rows" rows and "columns" columns.
    const board = d3.range(rows).map(d => []).map((row, i) => {
        return d3.range(columns).map((col, j) => ({
            row: i,
            column: j,
            adjacent_mines: 0,
            is_mine_cell: Math.random() <= percentageOfMines, //[0-1) percentageOfMines = 30%
            isClicked: false


        }))
    });

    //console.log("board: ", board);  //this shows you the 2d array board

    const numMines = board.reduce((rowAccu, row) => rowAccu + row.reduce((colAccu, v) => colAccu + (v.is_mine_cell ? 1 : 0), 0), 0);
    console.log(`${numMines} mines were added to the board.`);

    const configAttrs = createConfigurationParameters(rows, columns);

    //set Adjacencies
    var i;
    var j;
    var v;
    var h;


    //check for neighbors, sets adjacent_mines
    for (i = 0; i < 10; i++) {
        for (j = 0; j < 10; j++) {
            for (v = -1; v < 2; v++) {
                for (h = -1; h < 2; h++) {
                    if (((v == 0 ^ h == 0)) || (v != 0 ^ h != 0) || (v != 0 && h != 0)) {
                        if ((i - v > -1) && (j - h > -1) && (i - v < 10) && (j - h < 10)) {
                            if (board[i - v][j - h].is_mine_cell == true) {
                                board[i][j].adjacent_mines += 1;
                            }
                        }
                    }
                }
            }
        }
    }

    //this function returns an array of neighbords, with the root cell being s.
    function findNeighbor(board, s) {
        var neighborList = [];
        var row = Math.floor(s / 10);
        var col = s % 10;
        var noAdjacent_mines = false;

        //+/- 1
        if (s - 1 > -1 && (Math.floor((s - 1) / 10) == row)) {

            if (board [(Math.floor((s - 1) / 10))][col].is_mine_cell == false) {
                neighborList.push(s - 1);
            }
        }
        if (s + 1 < 100 && (Math.floor((s + 1) / 10) == row)) {
            if (board[(Math.floor((s + 1) / 10))][col].is_mine_cell == false) {
                neighborList.push(s + 1);
            }
        }

        //+/- 9
        if (s - 9 > -1 && Math.floor((s - 9) / 10) == row - 1) {
            if (board[(Math.floor((s - 9) / 10))][col].is_mine_cell == false) {
                neighborList.push(s - 9);
            }
        }
        if (s + 9 < 100 && Math.floor((s + 9) / 10) == row + 1) {
            if (board[(Math.floor((s + 9) / 10))][col].is_mine_cell == false) {
                neighborList.push(s + 9);
            }
        }

        //+/- 10
        if (s - 10 > -1 && Math.floor((s - 10) / 10) == row - 1) {
            if (board[(Math.floor((s - 10) / 10))][col].is_mine_cell == false) {
                neighborList.push(s - 10);
            }
        }
        if (s + 10 < 100 && Math.floor((s + 10) / 10) == row + 1) {
            if (board[(Math.floor((s + 10) / 10))][col].is_mine_cell == false) {
                neighborList.push(s + 10);
            }
        }

        //+/- 11
        if (s - 11 > -1 && Math.floor((s - 11) / 10) == row - 1) {
            if (board[(Math.floor((s - 11) / 10))][col].is_mine_cell == false) {
                neighborList.push(s - 11);
            }
        }
        if (s + 11 < 100 && Math.floor((s + 11) / 10) == row + 1) {
            if (board[(Math.floor((s + 11) / 10))][col].is_mine_cell == false) {
                neighborList.push(s + 11);
            }
        }

        return neighborList;
    }

    //this function traverses the board, and when passed a cell that is not a mine, nor has an any adjacent mines, displays all neighboring whitespace and adjacent values
    function BFS(d, s) { //s is a value from 0 - (n*m -1)

        var elements = 100;
        var visited = new Array(elements).fill(false);

        var Q = new Queue(); //let Q be queue.
        Q.enqueue(s); //Inserting s in queue until all its neighbour vertices are marked.

        visited[s] = true; //mark s as visited.

        while (!Q.isEmpty()) {

            var v = Q.dequeue();
            //processing all the neighbours of v
            //for all neighbours w of v in Graph G if w is not visited (AND ADJACENCY < 1 and not mine cell)

            //make sure v is not a mine and has no adjacent mines
            if (board[Math.floor(v / 10)][(v % 10)].is_mine_cell == false) {
                const w = d3.select(`.board-cell-g-${Math.floor(v / 10)}-${v % 10}`);

                if (board[Math.floor(v / 10)][v % 10].adjacent_mines < 1) {
                    var nei = findNeighbor(board, v);

                    //draw blank cell
                   w.append('rect')
                       .attr('width', configAttrs.board_cell_size + 1)
                       .attr('height', configAttrs.board_cell_size + 1)
                       //.attr('stroke', configAttrs.board_cell_stroke)
                       .attr('fill', '#D3D3D1')
                }
                //draw adjacent cells
                if (board[Math.floor(v / 10)][v % 10].adjacent_mines > 0) {
                    w.append('text')
                        .attr('fill', d => d.adjacent_mines == 1 ? 'blue' : (d.adjacent_mines == 2 ? 'green' : (d.adjacent_mines == 3 ? 'red': d.adjacent_mines == 4 ? 'purple' : (d.adjacent_mines == 5 ? 'brown' : d.adjacent_mines == 6 ? 'orange' : d.adjacent_mines == 7 ? 'black' : 'pink'))) )
                        .text(d => d.adjacent_mines)
                        .attr('font-weight', 'bold')
                        .style("font-size", "30px")
                        .attr("transform", "translate(13,30)");
                }
                numUnopened--;

                //go through list of neighbors, find more
                for (var i = 0; i < nei.length; i++) {

                    if (visited[nei[i]] == false) {
                        visited[nei[i]] = true;

                        Q.enqueue(nei[i]);
                    }
                }
            }
        }
    }


    const svg = d3.select('body')
        .append('svg')
        .attr('class', 'main-svg')
        .attr('width', configAttrs.svg_width)
        .attr('height', configAttrs.svg_height)
        .attr('transform', `translate(${configAttrs.svg_margins.left}, ${configAttrs.svg_margins.top})`); //puts image in reasonable place


    // create the board
    //create groups for each of the rows
    const rowGroups = svg //everything in the row is in a group, this allows us to apply the transform just once for every row
        .selectAll('.row-group') //doesnt exist to begin with
        .data(board)
        .enter()
        .append('g')
        .attr('class', 'row-group') //give it a class name
        .attr('transform', (d, i) => `translate(${configAttrs.margins.left}, 
                    ${configAttrs.margins.top + i * (configAttrs.board_cell_size + configAttrs.board_cell_gap)})`);
    //transform moves it to the left (x) so that there is a margin to the left and gives it enough y as rows are added (also accounting for the y margin)

    //this puts cells into the rows
    const allCells = rowGroups.selectAll('.board-cell') //for each row, you bind the data
        .data(d => d) //number of elements
        .enter()
        .append('g')
        .attr('class', d => `board-cell board-cell-g-${d.row}-${d.column}`)
        .attr('transform', (d, i) => `translate(${i * (configAttrs.board_cell_size + configAttrs.board_cell_gap)}, 0)`)

    // append rectangles and add click handlers.
    allCells.append('rect')
        .attr('width', configAttrs.board_cell_size)
        .attr('height', configAttrs.board_cell_size)
        .attr('stroke', configAttrs.board_cell_stroke)
        .attr('fill', configAttrs.board_cell_fill)
        .attr('class', 'board-rect');

    allCells.append('rect')
        .attr('width', configAttrs.board_cell_size-2)
        .attr('height', configAttrs.board_cell_size-2)
        .attr('stroke', configAttrs.board_cell_stroke)
        .attr('fill', '#D3D3D9')

        .on("click", function (d) { //click handler
            d3.event.preventDefault();  //this prevents the browser from opening its own default event when right click happens

            if(inPlay == false){ //is this the first click?
                timerDemo();
                inPlay = true;
            }

            if (d.is_mine_cell == true) { //if the cell has a mine
                numUnopened = 0;

                //color the bomb cell that was clicked -> red
                const b = d3.select(`.board-cell-g-${d.row}-${d.column}`);

                //change the color of the last clicked cell before exposing all cells
                b.append('rect')
                    .attr('width', configAttrs.board_cell_size)
                    .attr('height', configAttrs.board_cell_size)
                    .attr('fill', 'red');

                appendMineToSelection(allCells); //draw mines

                //PRINT ADJACENT CELLS
                allCells.append('text')
                    .filter(d => d.adjacent_mines > 0 && d.is_mine_cell == false)
                    .attr('fill', d => d.adjacent_mines == 1 ? 'blue' : (d.adjacent_mines == 2 ? 'green' : (d.adjacent_mines == 3 ? 'red': d.adjacent_mines == 4 ? 'purple' : (d.adjacent_mines == 5 ? 'brown' : d.adjacent_mines == 6 ? 'orange' : d.adjacent_mines == 7 ? 'pink' : 'black'))))
                    .text(d => d.adjacent_mines)
                    .attr('font-weight', 'bold')
                    .style("font-size", "30px")
                    .attr("transform", "translate(13,30)");

                //PRINT BLANK CELLS
                allCells.append('rect')
                    .filter(d => d.adjacent_mines == 0 && d.is_mine_cell == false)
                    .attr('width', configAttrs.board_cell_size )
                    .attr('height', configAttrs.board_cell_size )
                    .attr('fill', '#D3D3D9');

                //STOP THE TIMER!
                d3.timer(() => myTimer.stop());

            } else if (d.adjacent_mines > 0) {//show the singular cell

                numUnopened --;

                //PRINT ADJACENT CELL
                const p = d3.select(`.board-cell-g-${d.row}-${d.column}`);

                p.append('text')
                    .attr('fill', d => d.adjacent_mines == 1 ? 'blue' : (d.adjacent_mines == 2 ? 'green' : (d.adjacent_mines == 3 ? 'red': d.adjacent_mines == 4 ? 'purple' : (d.adjacent_mines == 5 ? 'brown' : d.adjacent_mines == 6 ? 'orange' : d.adjacent_mines == 7 ? 'pink' : 'pink'))))
                    .text(d => d.adjacent_mines)
                    .attr('font-weight', 'bold')
                    .style("font-size", "30px")
                    .attr("transform", "translate(13,30)");


            } else { //show all neighboring white space

                var s = d.row * 10 + d.column;
                BFS(d, s);
            }

            //Win condition = number of unopened cells == number of mines
            if(numUnopened == numMines){

                //print a win statement!
                d3.select('body').append('svg').attr('width', 500).attr('height', 500);

                const win = d3.select('.main-svg').append('g');

                //Fun win statement
                win.append('rect')
                    .attr('width', '250')
                    .attr('height', '150')
                    .attr('fill', 'red')
                    .attr('transform', 'translate(120,170)');

                //Fun win statement
                win.append('rect')
                    .attr('width', '220')
                    .attr('height', '130')
                    .attr('fill', 'orange')
                    .attr('transform', 'translate(135,180)');

                //Fun win statement
                win.append('rect')
                    .attr('width', '200')
                    .attr('height', '100')
                    .attr('fill', 'yellow')
                    .attr('transform', 'translate(145,195)');

                //Fun win statement
                win.append('text')
                    .attr('fill', 'black')
                    .text('YOU WIN!')
                    .attr('font-weight', 'bold')
                    .style("font-size", "30px")
                   .attr("transform", "translate(175,260)");

                //STOP THE TIMER!
                d3.timer(() => myTimer.stop());
            }
        })
        .on("contextmenu", function (d) { // right-click
            d3.event.preventDefault();
            const g = d3.select(`.board-cell-g-${d.row}-${d.column}`); //selects the group in which the rectangle (that was clicked) presides

            if(inPlay == false){
                timerDemo();
                inPlay = true;
            }

            if (d.isClicked == false) {

                g.append('path') //this creates lines that connect the points in the flag drawing below
                    .attr('d', "M 0 0 L 3 0 L 3 25 M 3 0 L 15 8 L 3 15 L 3 25 L 0 25 L 0 0") //this is just the drawing of the flag
                    //M = move, moves the point without drawing the line, L = line, draws the line, and also moves the point. Coordinates are normal
                    .attr('transform', 'translate(12, 8)')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 1)
                    .attr('fill', 'green')
                    .attr('class', `flag-${d.row}-${d.column}`);

                d.isClicked = true;

            } else { //remove the flag on second right click on same cell
                d3.select("path").remove();
                d.isClicked = false;
            }

        });


//code.iamkate.com for use of Queue
    function Queue() {
        var a = [], b = 0;
        this.getLength = function () {
            return a.length - b
        };
        this.isEmpty = function () {
            return 0 == a.length
        };
        this.enqueue = function (b) {
            a.push(b)
        };
        this.dequeue = function () {
            if (0 != a.length) {
                var c = a[b];
                2 * ++b >= a.length && (a = a.slice(b), b = 0);
                return c
            }
        };
        this.peek = function () {
            return 0 < a.length ? a[b] : void 0
        }
    };
}



