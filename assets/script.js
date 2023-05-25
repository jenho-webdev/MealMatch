//keys that are storaged locally on user's localstorage. will be get when onload
var NINJAS_API = "qeQ/ixgJ1FhLzMigxs+yag==sahHalNRb0bq0szN";
var Spoonacular_API = "24ff974f730a4fbf98084b4f1a1c30eb";

//Recipe Request Page DOM
const searchBtn = document.querySelector("#search");
const saveBtn = document.querySelector("#save");
const nextBtn = document.querySelector("#next");
const resultContainer = document.querySelector("#result-container");
const recipeNavBtns = document.querySelector("#btn-row");
const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");
const apiModal = document.getElementById("apiModal");
const modalOverlay = document.getElementById("modalOverlay");

//API URLs
const fetchhRecipesURL = `https://api.spoonacular.com/recipes/complexSearch`;
const fetchCaloriesBurnt = `https://api.api-ninjas.com/v1/caloriesburnedactivities`;
const fetchExercises = `https://api.api-ninjas.com/v1/exercises?`;

//Global Var
const cuisineOptions = [
  "African",
  "Asian",
  "American",
  "British",
  "Cajun",
  "Caribbean",
  "Chinese",
  "Eastern European",
  "European",
  "French",
  "German",
  "Greek",
  "Indian",
  "Irish",
  "Italian",
  "Japanese",
  "Jewish",
  "Korean",
  "Latin American",
  "Mediterranean",
  "Mexican",
  "Middle Eastern",
  "Nordic",
  "Southern",
  "Spanish",
  "Thai",
  "Vietnamese",
];

//all the recipes searched in current browser session(page refresh will wipe this!)
var searchedRecipes = [];
//an idex to know which recipe is the user seeing now in current session
var currentRecipesIndex = 0;
var currentRecipeID = 0;
let cuisineSelector = {};
//------------------Locate Storage functions(https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

//----------------DOM functions and eventlistener functions-------------------------------------------

//on page load, hide the result dive and button row at the bottom.
//inir autocomplete input with pre-definded options.
//when user input and the input field autocompleted an option
//and hit the button, it will then pass the input value to fetchRecipe fuction
//and display the result along with sport details.

document.addEventListener("DOMContentLoaded", function () {
  if (document.title === "MealMatch") {
    // Hide the bottom section initially
    resultContainer.classList.add("hide");
    recipeNavBtns.classList.add("hide");

    // Clear the searched recipes from localStorage from old session
    localStorage.removeItem("recipes");

    //INITIALIZE AUTOCOMPLETE INPUT

    var options = {
      data: {
        Japanese: null,
        Chinese: null,
        Asian: null,
        American: null,
        British: null,
        French: null,
        Italian: null,
        Mexican: null,
        Indian: null,
        Greek: null,
        Thai: null,
        Vietnamese: null,
        Mexican: null,
        Korean: null,
        Spanish: null,
        German: null,
        mediterranean: null,
        cajun: null,
        caribbean: null,
        European: null,
      },
      limit: 2,
      minLength: 2,
    };
    var autocompleteInput = document.querySelector("#cuisine-input");
    var autocompleteInstance = M.Autocomplete.init(autocompleteInput, options);

    //search button event listener onclick
    searchBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const cuisine = autocompleteInput.value;
      const newRecipe = await fetchRecipe(cuisine);
      await sportSearch();
      computeDuration(newRecipe);
      displayArecipe(newRecipe);
      sportDisplayAll();
      // Remove the "hide" class from the bottom section container element
      resultContainer.classList.remove("hide");
      recipeNavBtns.classList.remove("hide");
    });
    //next button event listener
    nextBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const cuisine = autocompleteInput.value;
      const newRecipe = await fetchRecipe(cuisine);
      await sportSearch();
      computeDuration(newRecipe);
      displayArecipe(newRecipe);
      sportDisplayAll();
    });
  } else if (document.title === "Recipe Details") {
    //for Recripe Detail page use
    //Grab the Parms url
    const urlParams = new URLSearchParams(window.location.search);
    //get the id behind the q in the url
    var id = urlParams.get("q");
    //passing in the id to the get recipe from localStorage fucntion
    //that return a recipe object
    var recipe = getLocalRecipesDataByID(id);
    //pass in the returned recipe and call the display function out to the
    //recipe detail page
    displayRecipeDetails(recipe);
  }
});

//------------------------Recipes Related functions below-----------------------------------------------

//------------Fetch a Recripe from API------------------------

//Pass in cuisine(String) and return a "repackaged" recipe

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
    dishType: dishType, //obj
  };

  //push current recipe into var
  searchedRecipes.push(recipeOutput);
  currentRecipeID = recipeID;

  setLocalRecipesData(recipeOutput);

  //return the repackaged recipeData contain only data that we need
  return recipeOutput;
}
//------------->logic/compute------------------------------

//----------------->Set to localStorage---------------------------

//SET (one) recipe JOSON to localStorage
function setLocalRecipesData(recipe) {
  //check to see if anything storaged locally
  const localData = getLocalRecipesData();
  //getting the passing in obj's (recipe) ID
  const recipeID = recipe.recipeID;

  //check with the passing in recipe is a new recipe before pushing it and storage to local
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
//get recipe by ID function

function getLocalRecipesDataByID(recipeID) {
  const savedRecipes = JSON.parse(localStorage.getItem("recipes"));
  const returnRecipe = savedRecipes.find(
    (recipe) => recipe.recipeID == recipeID
  );
  return returnRecipe;
}
//------------------>display to UI-------------------------------
//display function for index.html page below
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
  const urlLink = `recipeDetails.html?q=${recipe.recipeID}`;
  redirectURL.setAttribute("href", urlLink);
  redirectURL.setAttribute("target", "_blank");
}

//fucntion to display recripe detils to recipeDetail.html page
function displayRecipeDetails(recipe) {
  // Get the elements that need to be updated
  if (document.title === "Recipe Details") {
    var stepsUL = document.querySelector("#steps");
    var foodImg = document.querySelector("#recipe-image");
    var ingredientsUL = document.querySelector("#ingredientsUL");
    const titleEl = document.querySelector("#recipe-title");

    // Update the elements with the recipe details
    foodImg.src = recipe.imgURL;
    titleEl.textContent = recipe.title;

    //loop through the array of step objs
    for (var i = 0; i < recipe.cookingSteps.length; i++) {
      var li = document.createElement("li");
      li.textContent = recipe.cookingSteps[i].step;
      stepsUL.appendChild(li);
    }
    //loop through the array of ing objs
    for (var i = 0; i < recipe.ingredients.length; i++) {
      var li = document.createElement("li");
      li.textContent = recipe.ingredients[i].original;
      ingredientsUL.appendChild(li);
    }
  }
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
const displaySportCaloriesLoop = [
  walkCalories,
  runCalories,
  bikeCalories,
  swimCalories,
];
const displaySportDurationLoop = [
  walkDuration,
  runDuration,
  bikeDuration,
  swimDuration,
];

//list of variables
var saveCurrentSport = []; //stores info from API call.
// var sampleMenuCalories = 1200;  //sample var used for testing sports code. will be replaced with actual food calories.
var sportSet = ["3.0 mph", "6.7 mph", "12-13.9 mph", "treading water, m"];
var sportInfoCurrent = []; // sports data gets stored here.
var sportDuration = []; //computed duration gets stored here.
var sportDurationCurrent = []; //array of collected durations
var sportInfoPackage = []; //array of sports information to be sent to local storage for use in recipeDetails page.

//----------->Get Sport Data-------------------------------------

//search sportSet variable content in order.
async function sportSearch() {
  if (sportInfoCurrent === undefined || sportInfoCurrent.length == 0) {
    //sportInfoCurrent = [];
    for (var i = 0; i < sportSet.length; i++) {
      var searchNinjaUrl =
        "https://api.api-ninjas.com/v1/caloriesburned?activity=" + sportSet[i];
      await fetch(searchNinjaUrl, { headers: { "X-Api-Key": NINJAS_API } })
        .then(function (response) {
          if (!response.ok) {
            throw response.json();
          }

          return response.json();
        })
        .then(function (data) {
          if (data == "") {
            return; //ends function early for bad search input.
          }

          sportInfoCurrent.push(data);
        })
        .catch(function (error) {
          notFound.textContent = "searchNinjaUrl_error";
        });
    }
    if (i === sportSet.length) {
      return;
    }
  } else {
    return;
  }
}

//------------------------>set------------------------------

//prepares sport information set. waiting to be stored into local storage to be used in recipeDetails page.
async function sportInfoPackagePrep() {
  sportInfoPackage = [];
  for (var i = 0; i < sportSet.length; i++) {
    var set = [sportInfoCurrent[i][0], { duration: sportDurationCurrent[i] }];
    sportInfoPackage.push(set);
  }
  if (i === sportSet.length) {
    return;
  }
}

// save to local storage
var mainPackage = [];
function storeIndexInfo() {
  mainPackage.push(sportInfoPackage); //adds sport information package at end of mainPackage
  localStorage.setItem("MealMatchIndex", JSON.stringify(mainPackage));
}

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
    displaySportCaloriesLoop[i].textContent =
      "Calories: \n " + sportInfoCurrent[i][0].calories_per_hour + "/hour";
  }
}

async function sportDisplayDuration() {
  for (var i = 0; i < displaySportDurationLoop.length; i++) {
    if (sportDurationCurrent[i] >= 1) {
      displaySportDurationLoop[i].textContent =
        "Duration: \n " + sportDurationCurrent[i].toFixed(1) + " hours";
    } else {
      var sportDurationMin = sportDurationCurrent[i] * 60;
      displaySportDurationLoop[i].textContent =
        "Duration: \n " + sportDurationMin.toFixed() + " minutes";
    }
  }
}

// bundled display functions for sports
function sportDisplayAll() {
  sportDisplayCalories();
  sportDisplayDuration();
}
