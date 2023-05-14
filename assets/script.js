
//API Keys
const NINJAS_API = "qeQ/ixgJ1FhLzMigxs+yag==sahHalNRb0bq0szN";
const Spoonacular_API = "c6c9bb9062a14ace88c599472838ee3f"
const Spoonacular_API_jen = 'c6c9bb9062a14ace88c599472838ee3f';
//Recipe Request Page DOM
const form1El = document.querySelector("form1");

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
const currentrecipe = {};


//----------------DOM functions and eventlistener functions-------------------------------------------

form1El.addEventListener("click", (event) => {
  
  if (event.target.tagName === "button" && event.target.id === "searchRecipeBtn") {
    // Do something with the clicked item

  }
    console.log(`You clicked on ${event.target.textContent}`);
    

  });

//---------------------->UI manipulation functions------------------------------

//on page load function to "do something"(ie. load localstorage for saved cuisines)
window.addEventListener("load", () => {
  
  
    
});


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
  currentrecipe = recipeOutput;
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

function displayArecipe () {};
//TO BE DONE AFTER UI IS FINALIZED

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






