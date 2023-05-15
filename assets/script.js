
//API Keys
const NINJAS_API = "qeQ/ixgJ1FhLzMigxs+yag==sahHalNRb0bq0szN";
const Spoonacular_API = "c6c9bb9062a14ace88c599472838ee3f"
const Spoonacular_API_jen = 'c6c9bb9062a14ace88c599472838ee3f';
//Recipe Request Page DOM
const cuisineInputEl = document.querySelector("#cuisine-input");
const sportInputEl = document.querySelector("#sport-input");
const submitBtn = document.querySelector("submit-btn");


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

//----------->Get Sport Data-------------------------------------
async function fetchActivities(calories)
{

    const sportData = await fetch(``);

}

//------------------------>set------------------------------



//------------------->compute-------------------------------


//------------------------>display-------------------------






