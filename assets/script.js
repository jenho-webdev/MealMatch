
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

window.addEventListener("load", () => {
  
});

async function fetchRecipes(cuisine){

    const recipes = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=cuisine=${cuisine}&number=2`
    );


}

async function fetchActivities(sport,duration)
{

    const sportData = await fect(``);

}

