
gameFunctions.copyObject = (return_obj, object) => {
	for (const element in object){
		return_obj[element] = object[element];
	}
}

gameFunctions.getRandomInt = (max) => {
  	return Math.floor(Math.random() * max) + 1;
}

gameFunctions.twoPointDistance = (pos_start, pos_end) => {
	// console.log(pos_start, pos_end)
	return Math.sqrt(Math.pow(pos_start.x - pos_end.x, 2) + Math.pow(pos_start.y - pos_end.y, 2))
}