


const pathfinder = class {
	constructor(grid) {	
		this.grid = grid,
		this.width = grid[0].length,
		this.height = grid.length,
			
		this.path = [],
		this.max_positions = 100,
		
		this.start = {
			x: 0,
			y: 0
		},
		this.current = {
			x: 0,
			y: 0
		},			
		this.end = {
			x: 0,
			y: 0
		}
		
		this.open = []
		this.closed = []
	}
	
	findPath(x_start, y_start, x_end, y_end, callback) {
		
		this.path = [];
		this.open = [];
		this.closed = [];
		
		this.start.x = x_start;
		this.start.y = y_start;
		this.end.x = x_end;
		this.end.y = y_end;
		
		// this.path.push(this.current)		
		
		// if(this.start.x === this.end.x && this.start.y === this.end.y){
		// 	return
		// }		
		
		//add start pos to open list, first needs converting into a node
		let start_node = {
			pos: this.start
		}
		start_node.f_cost = 999;
		this.open.push(start_node)
		// console.log(this)

        let path_found = false;
		
		//LOOP THROUGH MAX POSITIONS
		for(let i=0;i<this.max_positions;i++){
			
			//FIND OPEN NODE WITH LOWEST F_COST
			let f_cost = 1000;
			let index = -1;
			let saved_node
			// console.log(this)
			this.open.forEach((open_node, i) => {
				if(open_node.f_cost < f_cost){
                    f_cost = open_node.f_cost;
                    index = i;
					this.current = open_node;
					// console.log(this)
				}
			})
			
			
			//REMOVE THE LOWEST F_COST FROM OPEN LIST
			this.closed.push(this.current)
			// console.log(this)
			this.open.splice(index, 1);

			
			
			if(JSON.stringify(this.current.pos) === JSON.stringify(this.end)){
				// console.log("end met")
                // return
                path_found = true;
                break;
			}
			
			//GET SURROUNDING NODES
			let nodes = this.checkPosition();

			if(nodes){

				// let saved_node;
				nodes.forEach((node) => {
					
					//if neighbour non traversable or neighbour is in closed list
					if(node.cell !== 1 || this.closed.some(e => JSON.stringify(e.pos) === JSON.stringify(node.pos))){
						//skip
					}
					else{
						
						//IF OPEN LISTS INCLUDES THE CURRENT NODE
						if (this.open.some(e => JSON.stringify(e.pos) === JSON.stringify(node.pos))) {
							//GET ARRAY POSITION
							let index = this.open.findIndex((e) => JSON.stringify(e.pos) === JSON.stringify(node.pos));
							if(index !== -1){
								let open_node = this.open[index]
								if(node.f_cost < open_node.f_cost){
									this.open[index] = node;
								}
							}
							
							//CHECK TO SEE IF IT NEEDS UPDATING
							
						}else{
							//ADD THE NODE
							this.open.push(node)
						}
						
					}
					
				})
				
			}
		}

        if(path_found === true){
            console.log("PATH FOUND!")
            // console.log(this.closed[this.closed.length - 1])
            let index = this.closed.length - 1
            let node;
            this.path = []

            for(let i=0;i<this.max_positions;i++){

                node = this.closed[index]
                this.path.unshift(node.pos)

                index = this.closed.findIndex((e) => JSON.stringify(e.pos) === JSON.stringify(node.origin_pos));
                // console.log(index)

                if(index === -1){
                    break
                }

            }

            if(callback){
                callback(this.path)
            }
        }


		// const found = array1.findIndex((e) => JSON.stringify(e.num) === JSON.stringify({x:5,y:5}));
		
		// console.log(this)
		// return this.path;
		// callback(this.path);
		/**/
	}
	
	checkPosition(){		
		
		let nodes = []
		
		for(let x=-1;x<2;x++){
			for(let y=-1;y<2;y++){

				//SKIP IF NOT SAME PLACE OR DIAGONALS
				let skip = false;
				if(x === 0 && y === 0){
					skip = true;
				}
				if(x === -1 && y === -1 || x === 1 && y === -1){
				   skip = true;
				}
				if(x === -1 && y === 1 || x === 1 && y === 1){
				   skip = true;
				}				

				if(skip === false){
					let pos = {
						x: this.current.pos.x + x,
						y: this.current.pos.y + y
					}

					let run_check = true;
					let cell;
					if(pos.x >= 0 && pos.x < this.width 
					&& pos.y >= 0 && pos.y < this.height){
						cell = this.grid[pos.y][pos.x]	
						// if(cell !== 1){
						// 	run_check = false;
						// }
					}else{
						run_check = false;
					}

					if(run_check === true){
						let g_cost = gameFunctions.twoPointDistance(pos, this.current.pos)
						let h_cost = gameFunctions.twoPointDistance(pos, this.end)
						let f_cost = g_cost + h_cost;

						// if(return_info.distance === -1 || total_distance < return_info.distance){
						// 	return_info.distance = total_distance;
						// 	return_info.pos = pos;
						// }	
						
						let node = {
							origin_pos: this.current.pos,
							pos: pos,
							cell: cell,
							g_cost: cell,
							h_cost: h_cost,
							f_cost: f_cost
						}
						nodes.push(node)
					}
				}		
			}
		}		
		
		return nodes
	}
	
}
