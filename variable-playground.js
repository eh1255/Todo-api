var person = {
	name: 'Andrew',
	age: 21
}

function updatePerson(obj) {
	
	// Assigning a new value does not update the original object
	obj = {
		name: 'Andrew',
		age: 24
	}

	// Performing something on the object does
	// obj.age = 24;
}

updatePerson(person);
console.log(person);

// Array Example 
var grades = [15, 88];

function addGrages (gradesArr) {
	gradesArr.push(55); 		// modifitying the variable
	debugger;					// Stops the program here to see what the variables are
								// cont
								// repl to see variables
								// Cntrl + C to get out
								// kill to quit debugging
	gradesArr = [12, 33, 99];   // reassigning the variable
}

addGrages(grades);
console.log(grades);