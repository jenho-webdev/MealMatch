

//Recipe Detail page DOM
const recipeCont = document.querySelector("#content-container");
document.addEventListener('DOMContentLoaded', function() {
    // Hide the bottom section initially
   //# filler for now
    recipeCont.classList.add('hide');
  });

//Global Var


//all the recipes searched in current browser session(page refresh will wipe this!)
const searchedRecipes = [];
//an idex to know which recipe is the user seeing now in current session
var currentRecipesIndex = window.location; 





//----------------DOM functions and eventlistener functions-------------------------------------------
let searchValue = localStorage.getItem('') || "";

// Use the retrieved value in your code


//eventlistener for btn ? 
const saveButton = document.getElementById('book-details');
saveButton.addEventListener('click', saveInformation);



//------------------------Recipes Related functions below----

//get from localstorage function()
saveButton.addEventListener('click', function() {
    const savedItems = JSON.parse(localStorage.getItem('save-details'));

    const savedItemensConatainer = document.getElementById('savedItemsContainer');

    savedItemensConatainer.innerHTML = ''

    if (savedItems && savedItems.length > 0) {

        savedItems.forEach(function(item) { 
            const listItem = document.createElement('li');
            listItem.textContent = item;
            savedItemensConatainer.appendChild(listItem);
        });
        
    } else {
        const message = document.createElement('p');
        message.textContent = 'No saved items.';
        savedItemensConatainer.appenedChild(message);
    }
})

//display to UI function()






//------sport related function below --

//get from localstorage function

//display to UI function()