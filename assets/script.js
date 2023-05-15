
//API Keys
const NINJAS_API = "qeQ/ixgJ1FhLzMigxs+yag==sahHalNRb0bq0szN";
const Spoonacular_API = "c6c9bb9062a14ace88c599472838ee3f"
const Spoonacular_API_jen = 'c6c9bb9062a14ace88c599472838ee3f';

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

searchBtn.addEventListener("click", (e) => {

 e.preventDefault();
//Get select input
const optionEl = document.getElementById("cuisine-select");
//CAll get recipe function and pass in the input
if (optionEl) {

const cuisine = optionEl.value;
const newRecipe = fetchRecipe(cuisine);
// display result to UI
displayArecipe(newRecipe);
  
}

});


//---------------------->UI manipulation functions------------------------------

// on page load function to "do something"(ie. load localstorage for saved cuisines)

// window.onload = () => {

//   M.AutoInit();
// };
  
   
    



//------------------Locate Storage functions(https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

//-----------------------Get locally stored data---------------------------------------------------

//CALL getLocalRecipesData (); TO GET SAVED RECIPES FROM LOCAL STORAGE


//--------------------------Set data to local storage----------------------------------


//CALL setLocalRecipesData (recipe); TO SAVE RECIPE TO LOCAL STORAGE





//------------------------Recipes Related functions below-----------------------------------------------

// CALL displayArecipe (); OR displaySavedRecipes (); FOR RECIPE(S) OUTPUT TO UI;




//------------>Get ------------------------

//Pass in cuisine(String) and return a "repackaged" recipe
// return recipe contain {recipe name,calories,ID, image url,}
async function fetchRecipe(cuisine){
  
  //1.06pts per call that return a recipe with info and nutrition
  const recipeURL = await fetch(`https://api.spoonacular.com/recipes/complexSearch?cuisine=${cuisine}&number=1&addRecipeNutrition=true&apiKey=${Spoonacular_API_jen}`);

  const recipeData = await  recipeURL.json();
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
    cuisine:  cuisine,
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
function setLocalRecipesData (recipe) {

  const localData = getLocalRecipesData();
  const recipeID = recipe.recipeID
  
  const isRecipesUnique = localData.every((item) => item.recipeID === recipeID);
  
  if(isRecipesUnique) {

    localData.push(recipe);
    localStorage.setItem("recipes", JSON.stringify(localData));
  }
  else{
      throw error ("Recipes already saved in your recipes book");
  }
  
  
};

//------------------------Get saved recipes from local storage--------------

//GET (one) recipe, return (one) recipe JOSON from localStorage
function getLocalRecipesData () {
  const savedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
  return savedRecipes;
};


//------------------>display to UI-------------------------------

function displayArecipe (recipe) {
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
};


function displaySavedRecipes () {};
//TO BE DONE AFTER UI IS FINALIZED




//------------------------Activities Related functions below-----------------------------------------------

//----------->Get Sport Data-------------------------------------
async function fetchActivities(calories)
{

    const sportData = await fetch(``);

}

//------------------------>set------------------------------



//------------------->compute-------------------------------


//------------------------>display-------------------------






