let searchValue = document.getElementById("searchValue");

searchValue.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    getMealCategory();
  }
});

async function getMealCategory() {
  try {
    let gridContainer = document.getElementById("gridContainer");
    let empty = document.getElementById("empty")
    let card = "";
    let response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchValue.value}`
    );
    let resData = await response.data;
    let meals = resData.meals;

    if (meals && meals.length > 0) {
      for (let i = 0; i < meals.length; i++) {
        // console.log("meals.strMeal: ", meals[i].strMeal);
        card += `<div id="gridBlock" onclick="showIngredients('${meals[i].strMeal}')"  data-aos="fade-up" data-aos-duration="2000">
                <h2 id="name" data-aos="fade-up">${meals[i].strMeal}</h2>
                <div id="mealImage">
                  <img src=${meals[i].strMealThumb}  alt="" id="image" data-aos="zoom-in" data-aos-duration="2000">
                </div>
              </div>`;
      }

      if (card !== "") {
        gridContainer.innerHTML = card;
        empty.innerHTML = ""
      } 
      else {
        empty.style.display = "block"
        empty.innerHTML ="Not Found (please check the category again)";
      }
    } 
    else {
      gridContainer.innerHTML = ""
      empty.innerHTML =
      "Not Found (please check the category entered again)";
      empty.style.display = "block"
      }
    } catch (error) {
    console.error("Error fetching data:", error);
  }
}

let modal = document.getElementById("myModal");
let modalTitle = document.getElementById("modalTitle");
let ingredientsList = document.getElementById("ingredientsList");
let closeModal = document.getElementsByClassName("close")[0];
let recipe = document.getElementById("recipe")
let video = document.getElementById("videoLink")

function showIngredients(event) {
  let mealId = event;
  getMealDetails(mealId);
}

async function getMealDetails(mealId) {
  try {
    let response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealId}`
    );
    let dataRes = await response.data;
    let mealDetails = dataRes.meals;

    modalTitle.innerText = mealDetails[0].strMeal;
    ingredientsList.innerHTML = createIngredientsList(mealDetails);
    recipe.innerText = getRecipe(mealDetails)
    video.onclick = () => {
      videoReroute(mealDetails) 
    }
    // Show the modal
    modal.style.display = "block";
  } catch (err) {
    console.error("Error fetching meal details:", err);
  }
}


function createIngredientsList(mealDetails) {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    // Check if the ingredient exists and is not an empty string
    if (mealDetails[0][`strIngredient${i}`] && mealDetails[0][`strIngredient${i}`].trim() !== "") {
      ingredients.push(
        `<li>${mealDetails[0][`strMeasure${i}`]} ${mealDetails[0][`strIngredient${i}`]}</li>`
      );
    }
  } 
  return ingredients.join("");
}

function getRecipe(mealDetails){
  return mealDetails[0].strInstructions
  
}

function videoReroute(mealDetails){
  window.location.href = mealDetails[0].strYoutube
}

closeModal.onclick = function () {
  modal.style.display = "none";
};


window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
