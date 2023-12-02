// Get the search input element
let searchValue = document.getElementById("searchValue");

// Add an event listener to the search input for the Enter key
searchValue.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    // If Enter is pressed, call the getMealCategory function
    getMealCategory();
  }
});

// Async function to fetch meal categories based on the user input
async function getMealCategory() {
  try {
    // Get elements for displaying meals and empty message
    let gridContainer = document.getElementById("gridContainer");
    let empty = document.getElementById("empty")
    let card = "";

    // Make a GET request using axios to fetch meal data based on the category
    let response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchValue.value}`
    );
    
    // Extract data from the response
    let resData = await response.data;
    let meals = resData.meals;

    // Check if meals are found
    if (meals && meals.length > 0) {
      // Loop through each meal and create HTML cards
      for (let i = 0; i < meals.length; i++) {
        card += `<div id="gridBlock" onclick="showIngredients('${meals[i].strMeal}')"  data-aos="fade-up" data-aos-duration="2000">
                  <h2 id="name" data-aos="fade-up">${meals[i].strMeal}</h2>
                  <div id="mealImage">
                    <img src=${meals[i].strMealThumb}  alt="" id="image" data-aos="zoom-in" data-aos-duration="2000">
                  </div>
                </div>`;
      }

      // Check if any cards were generated
      if (card !== "") {
        // If cards are generated, display them in the gridContainer and hide the empty message
        gridContainer.innerHTML = card;
        empty.innerHTML = "";
      } else {
        // If no cards were generated, display a message in the empty div
        empty.style.display = "block";
        empty.innerHTML ="Not Found (please check the category again)";
      }
    } else {
      // If no meals are found, display a message in the empty div
      gridContainer.innerHTML = "";
      empty.innerHTML ="Not Found (please check the category entered again)";
      empty.style.display = "block";
    }
  } catch (error) {
    // Handle any errors that occur during the fetch
    console.error("Error fetching data:", error);
  }
}

// Get elements for the modal
let modal = document.getElementById("myModal");
let modalTitle = document.getElementById("modalTitle");
let ingredientsList = document.getElementById("ingredientsList");
let closeModal = document.getElementsByClassName("close")[0];
let recipe = document.getElementById("recipe")
let video = document.getElementById("videoLink")

// Function to show ingredients when a meal is clicked
function showIngredients(event) {
  let mealId = event;
  getMealDetails(mealId);
}

// Async function to fetch meal details based on the meal ID
async function getMealDetails(mealId) {
  try {
    let response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealId}`
    );
    let dataRes = await response.data;
    let mealDetails = dataRes.meals;

    // Set modal content
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

// Function to create an ingredients list HTML
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

// Function to get the recipe text from meal details
function getRecipe(mealDetails){
  return mealDetails[0].strInstructions
}

// Function to redirect to the YouTube video link
function videoReroute(mealDetails){
  window.location.href = mealDetails[0].strYoutube
}

// Event listener for closing the modal
closeModal.onclick = function () {
  modal.style.display = "none";
};

// Event listener to close the modal if clicked outside the modal content
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
