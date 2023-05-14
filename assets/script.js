
//API Keys
const NINJAS_API = "qeQ/ixgJ1FhLzMigxs+yag==sahHalNRb0bq0szN";
const Spoonacular_API = "c6c9bb9062a14ace88c599472838ee3f"
const Spoonacular_API_jen = 'c6c9bb9062a14ace88c599472838ee3f';
//const Spoonacular_API = "b7db31d63a4d49e4ba04b02bdfcde847";  //keiji

//Recipe Request Page DOM
const cuisineInputEl = document.querySelector("#cuisine-input");
const sportInputEl = document.querySelector("#sport-input");
const submitBtn = document.querySelector("submit-btn");
const saveDisplay = document.querySelector("#saveDisplay");  //In HTML, need to implemented ul with id= saveDisplay.


//Weekly Calendar page DOM


//API URLs
const fecthRecipesURL = `https://api.spoonacular.com/recipes/complexSearch`;
const fetchCaloriesBurnt = `https://api.api-ninjas.com/v1/caloriesburnedactivities`;
const fetchExercises = `https://api.api-ninjas.com/v1/exercises?`;

//Var for TESTING/PLACEHOLDER
const cuisine = "Japanese";
const sport = "run";
const duration = "1";
const durationUnit = "hour";

//Global Var
const Today = dayjs().day(); //gets day of current week



//----------------DOM functions and eventlistener functions-------------------------------------------


//---------------------->UI manipulation functions------------------------------

//on page load function to "do something"(ie. load localstorage for saved cuisines)
window.addEventListener("load", () => {
    
  //getLocalRecipesData();
    
});


//------------------Locate Storage functions(https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

//below are functions to load, save, display, and use locally stored cuisine element
var saveList = ""; //initial blank savelist at load. Array. store cuisine input.

//load local storage
function loadSaved() {
  var saved = JSON.parse(localStorage.getItem("saved"));
  console.log(saved);
  if (saved !== null) {
    saveList = saved;
  }}

//save input value
function storeSave() {
  saveList.push(cuisineInputEl.value);  //currently set to cuisine input. change if needed
  localStorage.setItem("saved", JSON.stringify(saveList));
  }

//displays the local storage save content. generates li with buttons nested to make list of saved content.
function displaySave() {
  saveDisplay.innerHTML = ""; //wipe reviously loaded content
  for (var i = 0; i < saveList.length; i++) { 
    var save = saveList[i]; 

    var li = document.createElement("li");
    li.textContent = "";
    li.setAttribute("saveValue", i);

    var button = document.createElement("button");
    button.textContent = save;

    li.appendChild(button);
    saveList.appendChild(li);
  }
}  

//re-search using saved content.
function reloadSave(event) {
  var element = event.target;

  if (element.matches("button") === true) {
    var index = element.parentElement.getAttribute("saveValue");
  console.log(index);
  inputValue = saveList[index];
  fetchRecipe(cuisine); //or other function to start cuisine search process.
  }
}

//-----------------------Get locally stored data---------------------------------------------------

//GET (one) recipe, return (one) recipe JOSON from localStorage
function getLocalRecipesData () {

  const recipes = localStorage.getItem("recipes");
  return recipes;
};



//--------------------------Set data to local storage----------------------------------

//SET (one) recipe JOSON to localStorage
function setLocalRecipesData (recipe) {

  const localData = getLocalRecipesData();
  localData.push(recipe);
  localStorage.setItem("recipes", localData);

};

//--------------------------HTML changing functions--------------------------------------------------------

//moves to page2.html
function moveHTML(){
  var queryString = "./page2.html?q=" + cuisineInputEl.value;

  location.assign(queryString);
}

//------------------------Recipes Related functions below-----------------------------------------------


//------------>Get ------------------------

//Pass in cuisine(String) and return a "repackaged" recipe
// return recipe contain {recipe name,calories,ID, image url,}
async function fetchRecipe(cuisine){
  
  //1.06pts per call that return a recipe with info and nutrition
  const fetchRecipe = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?cuisine=${cuisine}&number=1&addRecipeNutrition=true&apiKey=${Spoonacular_API_jen}`
  );
  const recipeData = await fetchRecipe.json();
  const nutrients = recipeData.results[0].nutrition.nutrients;
  const calories = nutrients.find((item) => item.name === "Calories").amount;
  // const saturatedFat = nutrients.find(item => item.name === "Saturated fat").amount;
  const recipeID = recipeData.results[0].id;
  const recipeImgUrl = recipeData.results[0].image;
  const readyInMinutes = recipeData.results[0].readyInMinutes;
  const title = recipeData.results[0].title;
  const vegan = recipeData.results[0].vegan;
    // repackage all the recipe data that we need into a new obj
  const recipeOutput = 
  {
    calories: calories,
    recipeID: recipeID,
    imgURL: recipeImgUrl,
    min: readyInMinutes,
    title: title,
    vegan: vegan,
  }
  //return the repackaged recipeData contain only data that we need
  return recipeOutput;

}
//------------->logic/compute------------------------------



//----------------->set to localStorage---------------------------



//------------------>display to UI-------------------------------







//------------------------Activities Related functions below-----------------------------------------------

//initial var sample
var sampleMenuCalories = 123;  //sample var used for testingcode . 
var sportResult = "default";
var sportCalories = 1;
var sportDuration = "";


//----------->Get Sport Data-------------------------------------
//Sample of Jen's async
//async function fetchActivities(calories){const sportData = await fetch(``);}


//search for activities based on sport var (currently use only the [0] of the API response array)
function sportSearch(){
var searchNinjaUrl = "https://api.api-ninjas.com/v1/caloriesburned?activity=" + sport;
fetch(searchNinjaUrl,
{headers: { 'X-Api-Key': NINJAS_API},})
.then(function (response) {
  if (!response.ok) {
    throw response.json();
  }

  return response.json();
})
.then(function (data) {
  if (data == "") {
    console.log("search input did not have output. try something else");
    return;  //ends function early for bad search input.
  }
  console.log(data); 
  sportResult = data[0];
  sportCalories = sportResult.calories_per_hour;
  console.log(sportResult);
  console.log(sportResult.name);
  console.log(sportResult.calories_per_hour);
  console.log(sportCalories);
})
.catch(function (error) {
  console.error(error);
  notFound.textContent = "searchNinjaUrl_error";
});
return;
}

//------------------------>set------------------------------


//------------------->compute-------------------------------

//get duration of sport in minutes to match menu calories
function computeDuration() {
  if (sportCalories == ""){
    console.log("coumputeDuration function errored");
    return;
  }
  sportDuration = sampleMenuCalories / sportCalories;
  console.log(sportDuration + "hours")
  var sportDurationMin = sportDuration * 60;
  console.log(sportDurationMin.toFixed() + "minutes");
  return;
}

//------------------------>display-------------------------






