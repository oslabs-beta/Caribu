function rps (num) {
  //start with inintial rps array
  rpsArr = [['rock'], ['paper'], ['scissors']]
  //base case
  if (num === 0) return rpsArr

  let iterArr = [...rpsArr]
  // for each iteration, map the elements in iterArr to three children variations, add them to a new array, and then reassign iterarr that new array
  for (let i = 1; i < num; i++) {
    //create new array
    let newArr = []
    //iterate through iteration array, we start with a parent element and make three children
    iterArr.forEach(parentEl => {
      //for each option in RPS
      rpsArr.forEach(rpsEl => {
        //make a child Array that contains all the choices so far from the parent arrray
        let childArr = [...parentEl]
        //push the next rps option (which needs to be spread bc its an array)
        childArr.push(...rpsEl)
        //push the result to the newArray
        newArr.push(childArr)
      })
    })
    // reassign the iteration array to the value of the newArray
    iterArr = newArr
  }
  //once the loop is fully iterated, return it
  return iterArr
}

console.log(rps(3))