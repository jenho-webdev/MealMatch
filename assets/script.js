
//API Keys
const NINJAS_API = "qeQ/ixgJ1FhLzMigxs+yag==sahHalNRb0bq0szN";
const Spoonacular_API = "15c0363f59de4bfba530413a239c2ccb"

//DOM
const cuisineInputEl = document.querySelector("#cuisine-input");
const sportInputEl = document.querySelector("#sport-input");
const day1Box = document.querySelector("#day1-box");
const day2Box = document.querySelector("#day2-box");
const day3Box = document.querySelector("#day3-box");
const day4Box = document.querySelector("#day4-box");
const day5Box = document.querySelector("#day5-box");
const day6Box = document.querySelector("#day6-box");
const day7Box = document.querySelector("#day7-box");

//API URLs
const fecthRecipesURL = `https://api.spoonacular.com/recipes/complexSearch`;
const fetchCaloriesBurnt = `https://api.api-ninjas.com/v1/caloriesburnedactivities`;
const fetchExercises = `https://api.api-ninjas.com/v1/exercises?`;

//Var for TESTING/PLACEHOLDER
const cuisine = "Japanese";
const sport = "run";
const duration = "1";
const durationUnit = "hour";




//----------------DOM functions and eventlistener functions-------------------------------------------


//---------------------->UI manipulation functions------------------------------

//on page load function to "do something"(ie. load localstorage for saved cuisines)
window.addEventListener("load", () => {
    
  getLocalData();
    
});



//------------------Locate Storage functions(https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

//-----------------------Get locally stored data---------------------------------------------------
function getLocalRecipesData () {

  const recipes = localStorage.getItem("recipes");
  return recipes;
};



//--------------------------Set data to local storage----------------------------------

function setLocalRecipesData (recipe) {

  const localData = getLocalRecipesData();
  localData.push(recipe);
  localStorage.setItem("recipes", localData);

};



//------------------------Recipes Related functions below-----------------------------------------------


//------------>Get ------------------------
async function fetchRecipes(cuisine){

    const recipes = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=cuisine=${cuisine}&number=1`
    )


}
//------------->logic/compute------------------------------



//----------------->set to localStorage---------------------------



//------------------>display to UI-------------------------------







//------------------------Activities Related functions below-----------------------------------------------

//----------->Get Sport Data-------------------------------------
async function fetchActivities(sport,duration)
{

    const sportData = await fetch(``);

}

//------------------------>set------------------------------



//------------------->compute-------------------------------


//------------------------>display-------------------------






