// Get elements for the random meal display
let randomName = document.getElementById("randomName");
let randomImage = document.getElementById("randomImage");
let Title = document.getElementById("modalTitle");

// Function to fetch and display a random meal
async function getRandomMeal() {
  try {
    // Make a GET request using axios to fetch a random meal
    let response = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    let dataRes = await response.data;
    let randomMeal = dataRes.meals[0];

    // Display the random meal name and image
    randomName.innerText = randomMeal.strMeal;
    randomImage.src = randomMeal.strMealThumb;

    // Attach a click event to the random image to show ingredients
    randomImage.onclick = function () {
      ingredients(randomMeal);
    };
  } catch (err) {
    console.error("error:", err);
  }
}

// Call getRandomMeal to initially display a random meal
getRandomMeal();

// Function to show ingredients of a random meal
function ingredients(randomMeal) {
  if (randomMeal) {
    let mealId = randomMeal.strMeal;
    getRandomMealDetails(randomMeal);
  } else {
    console.error("Invalid randomMeal data");
  }
}

// Function to display details of a random meal
function getRandomMealDetails(randomMeal) {
  Title.innerText = randomMeal.strMeal;
  ingredientsList.innerHTML = createRandomIngredientsList(randomMeal);
  recipe.innerText = getRandomRecipe(randomMeal);
  video.onclick = () => {
    videoRandomReroute(randomMeal);
  };
  // Show the modal
  modal.style.display = "block";
}

// Function to create an ingredients list HTML for a random meal
function createRandomIngredientsList(randomMeal) {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    // Check if the ingredient exists and is not an empty string
    if (
      randomMeal[`strIngredient${i}`] &&
      randomMeal[`strIngredient${i}`].trim() !== ""
    ) {
      ingredients.push(
        `<li>${randomMeal[`strMeasure${i}`]} ${
          randomMeal[`strIngredient${i}`]
        }</li>`
      );
    }
  }
  return ingredients.join("");
}

// Function to get the recipe text for a random meal
function getRandomRecipe(randomMeal) {
  return randomMeal.strInstructions;
}

// Function to redirect to the YouTube video link for a random meal
function videoRandomReroute(randomMeal) {
  window.location.href = randomMeal.strYoutube;
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
