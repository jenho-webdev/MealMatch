//API Keys
//hard coding the keys before we have the grab key fuctions on page load
// const NINJAS_API = "qeQ/ixgJ1FhLzMigxs+yag==sahHalNRb0bq0szN";
// const Spoonacular_API_Keiji = "b7db31d63a4d49e4ba04b02bdfcde847"; //keiji's key
// const Spoonacular_API_Douglas = "c6c9bb9062a14ace88c599472838ee3f";


//keys that are storaged locally on user's localstorage. will be get when onload
var NINJAS_API = null;
var Spoonacular_API = null;

//Recipe Request Page DOM
const searchBtn = document.querySelector("#search");
const saveBtn = document.querySelector("#save");
const nextBtn = document.querySelectorAll(".nav-btn-inline");
const resultContainer = document.querySelector("#results-container");
const recipeNavBtns = document.querySelector("#btn-row");
//API URLs
const fetchhRecipesURL = `https://api.spoonacular.com/recipes/complexSearch`;
const fetchCaloriesBurnt = `https://api.api-ninjas.com/v1/caloriesburnedactivities`;
const fetchExercises = `https://api.api-ninjas.com/v1/exercises?`;

//exporting information -Keiji what is this for? do you need t
const searchValue = document.getElementById('result-container').textContent;
localStorage.setItem('searchValue', searchValue);


//Global Var
// const Today = dayjs().day(); //gets day of current week

//all the recipes searched in current browser session(page refresh will wipe this!)
var searchedRecipes = [];
//an idex to know which recipe is the user seeing now in current session
var currentRecipesIndex = 0;
var currentRecipeID = 0;

//------------------Locate Storage functions(https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
// Store the API key locally
function setAPIKeyToLocal(name, key) {
  localStorage.setItem(name, key);
}

function getAPIKeyFromLocal(name) {
  return localStorage.getItem(name);
}

//----------------DOM functions and eventlistener functions-------------------------------------------
function getCuisineInput() {
  const cuisineSelect = document.getElementById("cuisine-select");
  const cuisine = cuisineSelect.value;
  return cuisine;
}

function getApiInput() {
  //check if both key exist locally
  Spoonacular_API = getAPIKeyFromLocal("spoonApiKey");
  NINJAS_API = getAPIKeyFromLocal("NinjasApikey");
  const apiModal = document.getElementById("apiModal");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalInstance = M.Modal.init(apiModal);
  //if anyone of the key is null, open modal to get keys from user
  if (!Spoonacular_API || !NINJAS_API) {
    // Initialize the modal

    // Open the modal
    modalInstance.open();

    // Add event listener to save the API key when the save button is clicked
    const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");

    saveApiKeyBtn.addEventListener("click", function () {
      const spoonApiKeyEl = document.getElementById("Spoon-API");
      const spoonApiKey = spoonApiKeyEl.value;
      const SportApiKeyEl = document.getElementById("Ninjas-API");
      const sportApiKey = SportApiKeyEl.value;
      //store the keys to local storage
      setAPIKeyToLocal("spoonApiKey", spoonApiKey);
      setAPIKeyToLocal("NinjasApikey", sportApiKey);

      // Close the modal
      apiModal.style.display = "none";
      modalOverlay.style.display = "none";
    });
  } else {
    // Open the modal
    modalInstance.close();
    modalOverlay.style.display = "none";
  }
}

function getRecipeIDFromURL() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("q");
}

//on page load, hide the result dive and button row at the bottom.
//check localstorage for stored API key, if no keys found, open modal and get user's input
//when user hit the saveApiKey button, it then store the key to local storage

document.addEventListener("DOMContentLoaded", function () {
  //set the keys either from local or user's input from pop up modal
    
  if (document.title === "MealMatch"){
    //set the keys either from local or user's input from pop up modal
    getApiInput();
     sportSearch();
  // Hide the bottom section initially
  if (resultContainer)
    resultContainer.classList.add("hide");

  recipeNavBtns.classList.add("hide");

  // Clear the searched recipes from localStorage from old session
  localStorage.removeItem("recipes");
}else if (document.title ==="Recipe Details"){

  getLocalRecipesDataByID()




}







});


// Event listener for search button
searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  // Remove the "hide" class from the bottom section container element
  if(resultContainer)
    resultContainer.classList.remove("hide");
  recipeNavBtns.classList.remove("hide");

  const cuisine = getCuisineInput();
  const newRecipe = await fetchRecipe(cuisine);
  computeDuration(newRecipe);
  displayArecipe(newRecipe);
  sportDisplayAll();
});

//eventlistener for next buttons

nextBtn.addEventListener("click", async (e) => 
{
  e.preventDefault();
  const cuisine = getCuisineInput();
  const newRecipe = await fetchRecipe(cuisine);
  computeDuration(newRecipe);
  displayArecipe(newRecipe);
  sportDisplayAll();
  
});

//---------------------->UI manipulation functions------------------------------

//--------------------------HTML changing functions--------------------------------------------------------

// //moves to recipeDetails.html
// function moveHTML() {
//   var queryString = "./recipeDetails.html?q=" + currentRecipesIndex;
//   location.assign(queryString);
// }

//------------------------Recipes Related functions below-----------------------------------------------

//------------Fetch a Recripe from API------------------------

//Pass in cuisine(String) and return a "repackaged" recipe
// return a repackaged recipe object

async function fetchRecipe(cuisine) {
  const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${Spoonacular_API}&cuisine=${cuisine}&sort=random&number=1&addRecipeNutrition=true&fillIngredients=true`;

  const apiFetch = await (await fetch(apiUrl)).json();

  const recipeObj = apiFetch.results[0]; //recipe object

  //things that are under the recipeData.results[0] from response
  const recipeID = recipeObj.id;
  const recipeImgUrl = recipeObj.image;
  const summary = recipeObj.summary;
  const readyInMinutes = recipeObj.readyInMinutes;
  const title = recipeObj.title;
  const vegan = recipeObj.vegan;
  const ingredients = recipeObj.extendedIngredients;
  const cookingSteps = recipeObj.analyzedInstructions[0].steps;

  //things that is under the butrients array
  const nutrients = recipeObj.nutrition.nutrients; //"nutrients array of objects"
  const calories = nutrients.find((item) => item.name === "Calories").amount;
  const dishType = recipeObj.dishTypes; //return the first type only

  // repackage all the recipe data that we need into a new obj
  const recipeOutput = {
    cuisine: cuisine,
    calories: calories, //int
    ingredients: ingredients, //array of obj
    summary: summary, //string
    recipeID: recipeID, //int
    imgURL: recipeImgUrl,
    min: readyInMinutes, //int
    title: title, //string
    vegan: vegan, //boolean
    cookingSteps: cookingSteps, //array of obj
    dishType: dishType //obj
  };

  //push current recipe into var and advance index
  searchedRecipes.push(recipeOutput);
  currentRecipeID = recipeID;
  //return the repackaged recipeData contain only data that we need
  setLocalRecipesData(recipeOutput);
  return recipeOutput;
}
//------------->logic/compute------------------------------

//----------------->Set to localStorage---------------------------

//SET (one) recipe JOSON to localStorage
function setLocalRecipesData(recipe) {
  const localData = getLocalRecipesData();
  const recipeID = recipe.recipeID;

  const isRecipesUnique = localData.every((item) => item.recipeID !== recipeID);

  if (isRecipesUnique) {
    localData.push(recipe);
    localStorage.setItem("recipes", JSON.stringify(localData));
  }
}

//------------------------Get saved recipes from local storage--------------

//GET (one) recipe, return (one) recipe JOSON from localStorage
function getLocalRecipesData() {
  const savedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
  return savedRecipes;
}
function getLocalRecipesDataByID(recipeID) {
  const savedRecipes = JSON.parse(localStorage.getItem("recipes"));
  return savedRecipes.find((recipe) => recipe.recipeId === recipeID);
}

//------------------>display to UI-------------------------------

function displayArecipe(recipe) {
  // Get the elements that need to be updated
  const recipeImgEl = document.querySelector("#recipeImg");
  const recipeTitleEl = document.querySelector("#recipeTitleEl");
  const caloriesEl = document.querySelector("#calories");
  const recripeSummary = document.querySelector("#summary");
  const redirectURL = document.querySelector("#redirectURL");

  // Update the elements with the recipe details
  recipeImgEl.src = recipe.imgURL;
  recipeTitleEl.textContent = recipe.title;
  caloriesEl.textContent = `Calories: ${recipe.calories}`;
  recripeSummary.innerHTML = `${recipe.summary}`;
  redirectURL.setAttribute('href', `recipeDetails.html?q=${recipe.recipeId}`);
  redirectURL.setAttribute('target', '_blank');
}
//========================================================================================================
//------------------------Activities Related functions below-----------------------------------------------

//Sports area DOM
const walk = document.querySelector("#walk");
const walkCalories = document.querySelector("#walkCalories");
const walkDuration = document.querySelector("#walkDuration");
const run = document.querySelector("#run");
const runCalories = document.querySelector("#runCalories");
const runDuration = document.querySelector("#runDuration");
const bike = document.querySelector("#bike");
const bikeCalories = document.querySelector("#bikeCalories");
const bikeDuration = document.querySelector("#bikeDuration");
const swim = document.querySelector("#swim");
const swimCalories = document.querySelector("#swimCalories");
const swimDuration = document.querySelector("#swimDuration");
const displaySportCaloriesLoop = [walkCalories, runCalories, bikeCalories, swimCalories];
const displaySportDurationLoop = [walkDuration, runDuration, bikeDuration, swimDuration];





//list of variables
var saveCurrentSport = []; //stores info from API call.
// var sampleMenuCalories = 1200;  //sample var used for testing sports code. will be replaced with actual food calories. 
var sportSet = ["3.0 mph", "6.7 mph", "12-13.9 mph", "treading water, m"]
var sportInfoCurrent = []; // sports data gets stored here.
var sportDuration = []; //computed duration gets stored here.
var sportDurationCurrent = [];  //array of collected durations
var sportInfoPackage = []; //array of sports information to be sent to local storage for use in recipeDetails page.


//----------->Get Sport Data-------------------------------------

//search sportSet variable content in order.
async function sportSearch(){
  if (sportInfoCurrent === undefined || sportInfoCurrent.length == 0) {
  //sportInfoCurrent = [];
  for (var i = 0; i < sportSet.length; i++) {
var searchNinjaUrl = "https://api.api-ninjas.com/v1/caloriesburned?activity=" + sportSet[i];
await fetch(searchNinjaUrl,
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

  sportInfoCurrent.push(data);

})
.catch(function (error) {
  console.error(error);
  notFound.textContent = "searchNinjaUrl_error";
});
// console.log(i);
}
if (i === sportSet.length){
  console.log(sportInfoCurrent);

return;
}
}
else {
  return;
}
}

//------------------------>set------------------------------

//prepares sport information set. waiting to be stored into local storage to be used in recipeDetails page.
async function sportInfoPackagePrep() {
  sportInfoPackage = [];
  for (var i = 0; i < sportSet.length; i++) {
    var set = [sportInfoCurrent[i][0], {duration: sportDurationCurrent[i]}]
    sportInfoPackage.push(set);
  }
  if (i === sportSet.length){
    console.log(sportInfoPackage);
    return;
  }
  
}

// save to local storage
var mainPackage = [];
function storeIndexInfo() {
  mainPackage.push(sportInfoPackage);  //adds sport information package at end of mainPackage
  localStorage.setItem("MealMatchIndex", JSON.stringify(mainPackage));
  };

//------------------->compute-------------------------------

//get duration of sport in minutes to match menu calories
async function computeDuration(recipe) {
  sportDurationCurrent = [];
  sportDuration = [];
  for (var i = 0; i < sportInfoCurrent.length; i++) { 
    var sportCalories = sportInfoCurrent[i][0].calories_per_hour;
  sportDuration = recipe.calories / sportCalories;
  sportDurationCurrent.push(sportDuration);
}
}

//------------------->display-------------------------------

async function sportDisplayCalories() {
  for (var i = 0; i < displaySportCaloriesLoop.length; i++) { 
    displaySportCaloriesLoop[i].textContent = "Calories: \n " + sportInfoCurrent[i][0].calories_per_hour +"/hour";
  }
}

async function sportDisplayDuration() {
  for (var i = 0; i < displaySportDurationLoop.length; i++) { 
    if (sportDurationCurrent[i] >= 1){
      displaySportDurationLoop[i].textContent = "Duration: \n " + sportDurationCurrent[i].toFixed(1)+ " hours";
    }
    else {
      var sportDurationMin = sportDurationCurrent[i] * 60
      displaySportDurationLoop[i].textContent = "Duration: \n " + sportDurationMin.toFixed()+ " minutes";
    }
}
}

// bundled display functions for sports
function sportDisplayAll(){
  sportDisplayCalories();
  sportDisplayDuration();
}