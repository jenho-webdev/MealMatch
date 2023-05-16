//API Keys
const NINJAS_API = "qeQ/ixgJ1FhLzMigxs+yag==sahHalNRb0bq0szN";

//const Spoonacular_API = "b7db31d63a4d49e4ba04b02bdfcde847";  //keiji's key
const Spoonacular_API = "c6c9bb9062a14ace88c599472838ee3f";
const Spoonacular_API_jen = "c6c9bb9062a14ace88c599472838ee3f";

//Recipe Request Page DOM
const searchBtn = document.querySelector("#search");
const saveBtn = document.querySelector("#save");
const backBtn = document.querySelector("#back");
const nextBtn = document.querySelector("#next");

//API URLs
const fecthRecipesURL = `https://api.spoonacular.com/recipes/complexSearch`;
const fetchCaloriesBurnt = `https://api.api-ninjas.com/v1/caloriesburnedactivities`;
const fetchExercises = `https://api.api-ninjas.com/v1/exercises?`;

//Global Var
// const Today = dayjs().day(); //gets day of current week

//all the recipes searched in current browser session(page refresh will wipe this!)
const searchedRecipes = [];
//an idex to know which recipe is the user seeing now in current session
var currentRecipesIndex = 0;

//----------------DOM functions and eventlistener functions-------------------------------------------

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  //Get select input
  const optionEl = document.getElementById("cuisine-select");
  //CAll get recipe function and pass in the input
  if (optionEl) {
    const cuisine = optionEl.value;
    const newRecipe = await fetchRecipe(cuisine);
    // display result to UI
    displayArecipe(newRecipe);
  }
});

//---------------------->UI manipulation functions------------------------------
//----display content after selecting cuisine------------------
const button = document.getElementById('search');
const content = document.getElementById('results');

button.addEventListener('click', function() {
  if (content.style.display === 'none') {
    content.style.display = 'block';
  } else {
    content.style.display = 'none';
  }
});

//------------------Locate Storage functions(https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)


//-----------------------Get locally stored data---------------------------------------------------

//CALL getLocalRecipesData (); TO GET SAVED RECIPES FROM LOCAL STORAGE

//--------------------------Set data to local storage----------------------------------

//CALL setLocalRecipesData (recipe); TO SAVE RECIPE TO LOCAL STORAGE

//--------------------------HTML changing functions--------------------------------------------------------

//moves to page2.html
function moveHTML(){
  var queryString = "./page2.html?q=" + cuisineInputEl.value;

  location.assign(queryString);
}

//------------------------Recipes Related functions below-----------------------------------------------

// CALL displayArecipe (); OR displaySavedRecipes (); FOR RECIPE(S) OUTPUT TO UI;

//------------>Get ------------------------

//Pass in cuisine(String) and return a "repackaged" recipe
// return recipe contain {recipe name,calories,ID, image url,}
async function fetchRecipe(cuisine) {
  //1.06pts per call that return a recipe with info and nutrition
  const recipeURL = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?cuisine=${cuisine}&number=1&addRecipeNutrition=true&apiKey=${Spoonacular_API}`
  );

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
  currentRecipesIndex++;
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
  ingredientsEl.innerHTML = `<b>Ingredients:</b><br>${recipe.ingredients.join(
    "<br>"
  )}`;
  instructionsEl.innerHTML = `<b>Instructions:</b><br>${recipe.instructions.join(
    "<br>"
  )}`;

  // Scroll to the recipe section
  document
    .querySelector("#recipe-section")
    .scrollIntoView({ behavior: "smooth" });
}

function displaySavedRecipes() {};
//TO BE DONE AFTER UI IS FINALIZED

//------------------------Activities Related functions below-----------------------------------------------

//initial var sample
var sampleMenuCalories = 123;  //sample var used for testingcode . 
var sportResult = "default";
var sportCalories = 1;
var sportDuration = "";
var sport0 = "3.0 mph" //output = Walking 3.0 mph, moderate
var sport1 = "6.7 mph" //output = Running, 6.7 mph (9 min mile)
var sport2 = "12-13.9 mph" //output = Cycling, 12-13.9 mph, moderate
var sport3 = "treading water, m" //output = Swimming, treading water, moderate



//----------->Get Sport Data-------------------------------------
//Sample of Jen's async
//async function fetchActivities(calories){const sportData = await fetch(``);}


//search for activities based on sport var (currently use only the [0] of the API response array)
function sportSearch(){
var searchNinjaUrl = "https://api.api-ninjas.com/v1/caloriesburned?activity=" + sport2;
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

async function fetchActivities(calories) {
  const sportData = await fetch(``);
}

//------------------------>set------------------------------

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

function displaySport0() {
  console.log("work after HTML layout determined")
};

function displaySport1() {
  console.log("work after HTML layout determined")
};

function displaySport2() {
  console.log("work after HTML layout determined")
};

function displaySport3() {
  console.log("work after HTML layout determined")
};

//------------------->compute-------------------------------

//------------------------>display-------------------------
