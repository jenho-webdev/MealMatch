// API Keys
// hard coding the keys before we have the grab key fuctions on page load
const NINJAS_API = "qeQ/ixgJ1FhLzMigxs+yag==sahHalNRb0bq0szN";
const Spoonacular_API_Keiji = "b7db31d63a4d49e4ba04b02bdfcde847"; //keiji's key
const Spoonacular_API_Douglas = "c6c9bb9062a14ace88c599472838ee3f";
const Spoonacular_API_jen = "c6c9bb9062a14ace88c599472838ee3f";

// //keys that are storaged locally on user's localstorage. will be get when onload
// var NINJAS_API = null;
// var Spoonacular_API = null;

//Recipe Request Page DOM
const searchBtn = document.querySelector("#search");
const saveBtn = document.querySelector("#save");
const nextBtn = Array.from(document.querySelectorAll(".nav-btn-inline"));
const resultContainer = document.querySelector("#results-container");
const recipeNavBtns = document.querySelector("#btn-row");
//API URLs
const fecthRecipesURL = `https://api.spoonacular.com/recipes/complexSearch`;
const fetchCaloriesBurnt = `https://api.api-ninjas.com/v1/caloriesburnedactivities`;
const fetchExercises = `https://api.api-ninjas.com/v1/exercises?`;

//exporting information
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
 function setAPIKeyToLocal (name,key)
 {
    localStorage.setItem(name, key);
 };

 function getAPIKeyFromLocal(name) 
 {
   return localStorage.getItem(name);
 };


//-----------------------Get locally stored data---------------------------------------------------

//CALL getLocalRecipesData (); TO GET SAVED RECIPES FROM LOCAL STORAGE

//--------------------------Set data to local storage----------------------------------

//CALL setLocalRecipesData (recipe); TO SAVE RECIPE TO LOCAL STORAGE


//----------------DOM functions and eventlistener functions-------------------------------------------
function getCuisineInput() {
  const cuisineSelect = document.getElementById("cuisine-select");
  const cuisine = cuisineSelect.value;
  return cuisine;
}

function getApiInput()
{
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

  }else {
    // Open the modal
    modalInstance.close();
    modalOverlay.style.display = "none";
  };
  
};

//on page load, hide the result div and button row at the bottom.
//check localstorage for stored API key, if no keys found, open modal and get user's input
//when user hit the saveApiKey button, it then store the key to local storage

document.addEventListener("DOMContentLoaded", function () {
  
  //set the keys either from local or user's input from pop up modal
  getApiInput();

  // Hide the bottom section initially
  resultContainer.classList.add("hide");
  recipeNavBtns.classList.add("hide");

  // Clear the searched recipes from localStorage from old session
  localStorage.removeItem("recipes");

});

// Event listener for search button
searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  // Remove the "hide" class from the bottom section container element
  resultContainer.classList.remove("hide");
  recipeNavBtns.classList.remove("hide");

  const cuisine = getCuisineInput();
  const newRecipe = await fetchRecipe(cuisine);
  displayArecipe(newRecipe);
});

//eventlistener for next and back buttons

nextBtn.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    let loadRecipe = {};
    let setIndex = 0;

    if (btn.id === "next")
     {
      const cuisine = getCuisineInput();
      const newRecipe = await fetchRecipe(cuisine);
       displayArecipe(newRecipe);
    }
  });
});

//---------------------->UI manipulation functions------------------------------


//--------------------------HTML changing functions--------------------------------------------------------

//moves to recipeDetails.html
function moveHTML() {
  var queryString = "./recipeDetails.html?q=" + currentRecipesIndex;
  location.assign(queryString);
}

//------------------------Recipes Related functions below-----------------------------------------------

// CALL displayArecipe (); OR displaySavedRecipes (); FOR RECIPE(S) OUTPUT TO UI;

//------------>Get ------------------------

//Pass in cuisine(String) and return a "repackaged" recipe
// return recipe contain {recipe name,calories,ID, image url,}
async function fetchRecipe(cuisine) {
  //1.06pts per call that return a recipe with info and nutrition
  const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${Spoonacular_API_Douglas}&cuisine=${cuisine}&sort=random&number=1&addRecipeNutrition=true&fillIngredients=true`;

  const recipeData = await recipeURL.json();
  const nutrients = recipeData.results[0].nutrition.nutrients;
  const calories = nutrients.find((item) => item.name === "Calories").amount;
  // const saturatedFat = nutrients.find(item => item.name === "Saturated fat").amount;
  const recipeID = recipeData.results[0].id;
  const recipeImgUrl = recipeData.results[0].image;

  const readyInMinutes = recipeData.results[0].readyInMinutes;
  const title = recipeData.results[0].title;
  const vegan = recipeData.results[0].vegan;
  // repackage all the recipe data that we need into a new obj
  const recipeOutput = {
    cuisine: cuisine,
    calories: calories,
    recipeID: recipeID,
    imgURL: recipeImgUrl,
    min: readyInMinutes,
    title: title,
    vegan: vegan,
  };

 

  //push current recipe into var and advance index
  searchedRecipes.push(recipeOutput);
  currentRecipeID = recipeID;
  //return the repackaged recipeData contain only data that we need
  return recipeOutput;
}
//------------->logic/compute------------------------------

//----------------->Set to localStorage---------------------------

//SET (one) recipe JOSON to localStorage
function setLocalRecipesData(recipe) {
  const localData = getLocalRecipesData();
  const recipeID = recipe.recipeID;

  const isRecipesUnique = localData.every((item) => item.recipeID === recipeID);

  if (isRecipesUnique) {
    localData.push(recipe);
    localStorage.setItem("recipes", JSON.stringify(localData));
  } else {
    throw error("Recipes already saved in your recipes book");
  }
}

//------------------------Get saved recipes from local storage--------------

//GET (one) recipe, return (one) recipe JOSON from localStorage
function getLocalRecipesData() {
  const savedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
  return savedRecipes;
}

//------------------>display to UI-------------------------------

function displayArecipe(recipe) {
  // Get the elements that need to be updated
  const recipeImgEl = document.querySelector("#recipeImgEl");
  const recipeTitleEl = document.querySelector("#recipeTitleEl");
  const caloriesEl = document.querySelector("#calories");
  const ingredientsEl = document.querySelector("#ingredients");
  const instructionsEl = document.querySelector("#instructions");

  // Update the elements with the recipe details
  recipeImgEl.src = recipe.image;
  recipeTitleEl.textContent = recipe.title;
  caloriesEl.textContent = `Calories: ${recipe.calories}`;
  recripeSummary.innerHTML = `${recipe.summary}`;
}

function displaySavedRecipes() {};
//TO BE DONE AFTER UI IS FINALIZED

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
var sampleMenuCalories = 1200;  //sample var used for testing sports code. will be replaced with actual food calories. 
var sportSet = ["3.0 mph", "6.7 mph", "12-13.9 mph", "treading water, m"]
var sportInfoCurrent = []; // sports data gets stored here.
var sportDuration = []; //computed duration gets stored here.
var sportDurationCurrent = [];  //array of collected durations
var sportInfoPackage = []; //array of sports information to be sent to local storage for use in recipeDetails page.


//----------->Get Sport Data-------------------------------------

//search sportSet variable content in order.
async function sportSearch(){
  sportInfoCurrent = [];
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
console.log(i);
}
if (i === sportSet.length){
  console.log(sportInfoCurrent);

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

//below are functions to save and load from local storage

//load local storage
// function loadSaved() {
//   var saved = JSON.parse(localStorage.getItem("saved"));
//   console.log(saved);
//   if (saved !== null) {
//     saveList = saved;
//   }}

// save to local storage
var mainPackage = [];
function storeIndexInfo() {
  mainPackage.push(sportInfoPackage);  //adds sport information package at end of mainPackage
  localStorage.setItem("MealMatchIndex", JSON.stringify(mainPackage));
  };

//------------------->compute-------------------------------

//get duration of sport in minutes to match menu calories
async function computeDuration() {
  sportDuration = [];
  for (var i = 0; i < sportInfoCurrent.length; i++) { 
    var sportCalories = sportInfoCurrent[i][0].calories_per_hour;
  sportDuration = sampleMenuCalories / sportCalories;
  console.log(sportDuration + "hours");
  var sportDurationMin = sportDuration * 60;
  console.log(sportDurationMin.toFixed() + "minutes");
  sportDurationCurrent.push(sportDuration.toFixed(1));
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
    displaySportDurationLoop[i].textContent = "Duration: \n " + sportDurationCurrent[i]+" hours";
  }
}

//test function to see all sport functions in action. 
//Get info from API -> calculate duration -> display info on HTML -> prepare sports information package
async function sportTest(){
  await sportSearch();
  await computeDuration();
  await sportDisplayCalories();
  await sportDisplayDuration();
  await sportInfoPackagePrep();
  return;
};