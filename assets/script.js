//API Keys
//hard coding the keys before we have the grab key fuctions on page load
// const NINJAS_API = "qeQ/ixgJ1FhLzMigxs+yag==sahHalNRb0bq0szN";
// const Spoonacular_API_Keiji = "b7db31d63a4d49e4ba04b02bdfcde847"; //keiji's key
// const Spoonacular_API_Douglas = "c6c9bb9062a14ace88c599472838ee3f";
// const Spoonacular_API_jen = "c6c9bb9062a14ace88c599472838ee3f";

//keys that are storaged locally on user's localstorage. will be get when onload
var NINJAS_API = null;
var Spoonacular_API = null;

//Recipe Request Page DOM
const searchBtn = document.querySelector("#search");
const saveBtn = document.querySelector("#save");
const nextBtn = Array.from(document.querySelectorAll(".nav-btn-inline"));
const resultContainer = document.querySelector("#results-container");
const recipeNavBtns = document.querySelector("#btn-row");
//API URLs
const fetchhRecipesURL = `https://api.spoonacular.com/recipes/complexSearch`;
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
function setAPIKeyToLocal(name, key) {
  localStorage.setItem(name, key);
}

function getAPIKeyFromLocal(name) {
  return localStorage.getItem(name);
}

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
//on page load, hide the result dive and button row at the bottom.
//check localstorage for stored API key, if no keys found, open modal and get user's input
//when user hit the saveApiKey button, it then store the key to local storage

document.addEventListener("DOMContentLoaded", function () {
  //set the keys either from local or user's input from pop up modal
  getApiInput();

  // Hide the bottom section initially
  if (resultContainer)
    resultContainer.classList.add("hide");

  recipeNavBtns.classList.add("hide");

  // Clear the searched recipes from localStorage from old session
  localStorage.removeItem("recipes");
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
  displayArecipe(newRecipe);
});

//eventlistener for next and back buttons

nextBtn.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    let loadRecipe = {};
    let setIndex = 0;

    if (btn.id === "next") {
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
  const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${Spoonacular_API}&cuisine=${cuisine}&sort=random&number=1&addRecipeNutrition=true&fillIngredients=true`;

  const apiFetch = await (await fetch(apiUrl)).json();

  const recipeObj = apiFetch.results[0]; //recipe object
  //things that are under the recipeData.results[0]

  const recipeID = recipeObj.id;
  const recipeImgUrl = recipeObj.image;
  const summary = recipeObj.summary;
  const readyInMinutes = recipeObj.readyInMinutes;
  const title = recipeObj.title;
  const vegan = recipeObj.vegan;
  const ingredients = recipeObj.extendedIngredients;

  //things that is under the butrients array
  const nutrients = recipeObj.nutrition.nutrients; //"nutrients array of objects"
  const calories = nutrients.find((item) => item.name === "Calories").amount;

  // repackage all the recipe data that we need into a new obj
  const recipeOutput = {
    index: currentRecipesIndex,
    cuisine: cuisine,
    calories: calories,
    ingredients: ingredients,
    summary: summary,
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

//------------------>display to UI-------------------------------

function displayArecipe(recipe) {
  // Get the elements that need to be updated
  const recipeImgEl = document.querySelector("#recipeImg");
  const recipeTitleEl = document.querySelector("#recipeTitleEl");
  const caloriesEl = document.querySelector("#calories");
  const recripeSummary = document.querySelector("#summary");

  // Update the elements with the recipe details
  recipeImgEl.src = recipe.imgURL;
  recipeTitleEl.textContent = recipe.title;
  caloriesEl.textContent = `Calories: ${recipe.calories}`;
  recripeSummary.innerHTML = `${recipe.summary}`;
}

// function displaySavedRecipes() {};
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





//list of variables
var saveCurrentSport = []; //initial blank savelist at load. Array. store cuisine input.
var sampleMenuCalories = 123; //sample var used for testingcode .
var sportResult = "default";
// var sportCalories = 1;
var sportDuration = [];
var sport0 = "3.0 mph"; //output = Walking 3.0 mph, moderate
var sport1 = "6.7 mph"; //output = Running, 6.7 mph (9 min mile)
var sport2 = "12-13.9 mph"; //output = Cycling, 12-13.9 mph, moderate
var sport3 = "treading water, m"; //output = Swimming, treading water, moderate

var sportSet = ["3.0 mph", "6.7 mph", "12-13.9 mph", "treading water, m"];
var sportInfoCurrent = [];
var sportDurationCurrent = [];
var sportInfoPackage = [];
const displaySportCaloriesLoop = [walkCalories, runCalories, bikeCalories, swimCalories];
const displaySportDurationLoop = [walkDuration, runDuration, bikeDuration, swimDuration];

//----------->Get Sport Data-------------------------------------
//Sample of Jen's async
//async function fetchActivities(calories){const sportData = await fetch(``);}

//search for activities based on sport var (currently use only the [0] of the API response array)

function sportSearch() {
  for (var i = 0; i < sportSet.length; i++) {
    var searchNinjaUrl =
      "https://api.api-ninjas.com/v1/caloriesburned?activity=" + sportSet[i];
    fetch(searchNinjaUrl, { headers: { "X-Api-Key": NINJAS_API } })
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }

        return response.json();
      })
      .then(function (data) {
        if (data == "") {
          console.log("search input did not have output. try something else");
          return; //ends function early for bad search input.
        }
        sportInfoCurrent.push(data);
        // console.log(data);
        // sportResult = data[0];
        // sportCalories = sportResult.calories_per_hour;
        // console.log(sportResult);
        // console.log(sportResult.name);
        // console.log(sportResult.calories_per_hour);
        // console.log(sportCalories);
      })
      .catch(function (error) {
        console.error(error);
        notFound.textContent = "searchNinjaUrl_error";
      });
    console.log(i);
  }
  if (i >= sportSet.length) {
    return;
  }
}

// async function fetchActivities(calories) {
//   const sportData = await fetch(``);
// }

//------------------->compute-------------------------------

//get duration of sport in minutes to match menu calories
function computeDuration() {
  for (var i = 0; i < saveList.length; i++) {
    var sportCalories = sportInfoCurrent[i][0].calories_per_hour;
    if (sportCalories == "") {
      console.log("coumputeDuration function errored");
      return;
    }
    sportDuration = sampleMenuCalories / sportCalories;
    console.log(sportDuration + "hours");
    var sportDurationMin = sportDuration * 60;
    console.log(sportDurationMin.toFixed() + "minutes");
    return;
  }
}

//------------------------>set------------------------------

//below are functions to load, save, display, and use locally stored cuisine element

//load local storage
// function loadSaved() {
//   var saved = JSON.parse(localStorage.getItem("saved"));
//   console.log(saved);
//   if (saved !== null) {
//     saveList = saved;
//   }}

//save input value
// function storeSaveSport() {
//   saveList.push(cuisineInputEl.value);  //currently set to cuisine input. change if needed
//   localStorage.setItem("saved", JSON.stringify(saveList));
//   }

//displays the local storage save content. generates li with buttons nested to make list of saved content.
// function displaySave() {
//   saveDisplay.innerHTML = ""; //wipe reviously loaded content
//   for (var i = 0; i < saveList.length; i++) { 
//     var save = saveList[i]; 

//     var li = document.createElement("li");
//     li.textContent = "";
//     li.setAttribute("saveValue", i);

//     var button = document.createElement("button");
//     button.textContent = save;

//     li.appendChild(button);
//     saveList.appendChild(li);
//   }
// }  

//re-search using saved content.
// function reloadSave(event) {
//   var element = event.target;

//   if (element.matches("button") === true) {
//     var index = element.parentElement.getAttribute("saveValue");
//   console.log(index);
//   inputValue = saveList[index];
//   fetchRecipe(cuisine); //or other function to start cuisine search process.
//   }
// }

//------------------------>display-------------------------
//first run searchSport() in chrome inspect before running the display functions

//get duration of sport in minutes to match menu calories
function computeDuration() {
  for (var i = 0; i < sportInfoCurrent.length; i++) { 
    var sportCalories = sportInfoCurrent[i][0].calories_per_hour
  if (sportCalories == ""){
    console.log("computeDuration function errored");
    return;
  }
  sportDuration = sampleMenuCalories / sportCalories;
  console.log(sportDuration + "hours")
  var sportDurationMin = sportDuration * 60;
  console.log(sportDurationMin.toFixed() + "minutes");
  sportDurationCurrent.push(sportDurationMin.toFixed());
}
}

//------------------->display-------------------------------

function sportDisplayCalories() {
  for (var i = 0; i < displaySportCaloriesLoop.length; i++) { 
    // var content = document.createElement("p");
    displaySportCaloriesLoop[i].textContent = "Calories: \n " + sportInfoCurrent[i][0].calories_per_hour +"/hour";
    // displaySportLoop[i].appendChild(content)
  }
}

function sportDisplayDuration() {
  for (var i = 0; i < displaySportDurationLoop.length; i++) { 
    // var content = document.createElement("p");
    displaySportDurationLoop[i].textContent = "Duration: \n " + sportDurationCurrent[i]+" minutes";
    // displaySportLoop[i].appendChild(content)
  }
}

