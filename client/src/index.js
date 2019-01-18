document.addEventListener('DOMContentLoaded', () => {
 
let add_note = false
let users = []
let all_notes = []
let note_in_question = 0
const side_bar_most_outer = document.querySelector('#sidebar')
const side_bar = document.querySelector('#users_div')
const body_of_page = document.querySelector('#mainBody')
const for_notes_in_body = document.querySelector("#for_note")
const new_botton = document.querySelector('#newNote')
const formContainer = document.querySelector('.container')
const editFormContainer = document.querySelector('.Edit_container')
let for_appending_new_notes = document.querySelector('#forappendingnewnotes')

let get_request = function (){

fetch('http://localhost:3000/api/v1/users/', {method: 'GET'})
.then((responseObject) => responseObject.json())
    .then((Data) => {
    users = Data
    all_notes = users[0].notes
   users.forEach(function(person){
   	side_bar.innerHTML += `<h3>${person.name}</h3>
   	<button type="button" id='newNote'>create Evernote</button><br>
   	<p><font color= 'blue'>All your Evernotes:</font></p>
   	${person.notes.map(note => `<div id=${note.id}>${note.id}: ${note.title}<br>
   		<button type="button" data-id=${note.id}>preview</button><br><br></div>
   		`).join('')}
   	`//I need this quote.....
   })//end for Each function
    })//end of last then function
}//end of function!


side_bar_most_outer.addEventListener('click', function(e){

	if (e.target.innerText == 'preview'){
		let target_note = all_notes.find(function(note){return e.target.dataset.id == note.id})
		
		for_notes_in_body.innerHTML = `<p> <font color="blue"> ${target_note.body}</font></p> 
		<button type="button" data-id=${target_note.id}>edit note</button>
		<button type="button" data-id=${target_note.id}>delete note</button>
		`

	}//end of displaying the note onto the body

	if (e.target.id == 'newNote'){

		add_note = !add_note
		if (add_note) {
    formContainer.style.display = 'block'	
    formContainer.addEventListener('submit',function(e){
    	e.preventDefault()
    	let new_title = formContainer.querySelector('#title').value
    	let new_body = formContainer.querySelector('#body').value

    	fetch('http://localhost:3000/api/v1/notes', {
    		method: 'POST',
    		headers: {
					  'Content-Type': 'application/json',
					  'Accept': 'application/json'},
			body: JSON.stringify({
				title: new_title,
				body: new_body,
				user_id: 3
			})
    	})//end of the fetch request for POST method
    	.then(response => response.json())//repasring the response from API
      .then(json => {
      	sidebar.innerHTML += `<div id=${json.id}>${json.id}: ${json.title}<br>
   		<button type="button" data-id=${json.id}>preview</button><br><br></div>
   		`
   		all_notes.push(json) 
      	})
    })//submit handler end bracket

    }//the form has been opened starting here, block doesnt mean "block" the form i guess..... 
    else {
    formContainer.style.display = 'none'
  }
	}//the create new note botton ending 	

})//end of event listener for preview click

			for_notes_in_body.addEventListener('click', function(e){
				if (e.target.innerText == 'delete note'){
					let target_note = all_notes.find(function(note){return e.target.dataset.id == note.id})

					fetch(`http://localhost:3000/api/v1/notes/${target_note.id}`, {method: 'DELETE'})
					.then(res=>(res.json()))

					document.getElementById(`${target_note.id}`).remove()


					//to update the DOM after deleting...

					// fetch('http://localhost:3000/api/v1/users/', {method: 'GET'})
					// .then((responseObject) => responseObject.json())
					//     .then((Data) => {
					//     users = Data
					//     all_notes = users[0].notes
					//    users.forEach(function(person){
					//    	side_bar.innerHTML = `<h3>${person.name}</h3>
					//    	<button type="button" id='newNote'>create Evernote</button><br>
					//    	<p><font color= 'blue'>All your Evernotes:</font></p>`
					//    })//end for Each function
					   
					   	// for_appending_new_notes.innerHTML = ''
					   	// all_notes.forEach(function(note) {for_appending_new_notes.innerHTML += `${note.id}: ${note.title}<br>
					   	// 	<button type="button" data-id=${note.id}>preview</button><br><br>`})

					    // })
					    //end of last then function

				}//end of if statement 
				else if (e.target.innerText == 'edit note'){
					let target_note = all_notes.find(function(note){return e.target.dataset.id == note.id})
					let new_title = formContainer.querySelector('#title').value
    				let new_body = formContainer.querySelector('#body').value

					fetch(`http://localhost:3000/api/v1/notes/${target_note.id}`, {
						method: 'PATCH',
						headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
        	title: new_title,
				body: new_body,
				user_id: 3
        })
					})

				}//else if bracket
			})//end of delete function listening 


formContainer.style.display = 'none'
get_request() //renders the page at splash 

})//end of DOM listening bracket
