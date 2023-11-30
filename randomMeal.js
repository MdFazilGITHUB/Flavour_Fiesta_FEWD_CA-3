let randomName = document.getElementById("randomName");
let randomImage = document.getElementById("randomImage");
let Title = document.getElementById("modalTitle");

async function getRandomMeal() {
  try {
    let response = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    let dataRes = await response.data;
    let randomMeal = dataRes.meals[0];

    randomName.innerText = randomMeal.strMeal;
    randomImage.src = randomMeal.strMealThumb;

    // Pass randomMeal data to the ingredients function using a closure
    randomImage.onclick = function () {
      ingredients(randomMeal);
    };
  } catch (err) {
    console.error("error:", err);
  }
}

getRandomMeal()

function ingredients(randomMeal) {
    if (randomMeal) {
      let mealId = randomMeal.strMeal;
      getRandomMealDetails(randomMeal);
    } else {
      console.error("Invalid randomMeal data");
    }
  }
  
  function getRandomMealDetails(randomMeal) {
    Title.innerText = randomMeal.strMeal;  // Fix here
    ingredientsList.innerHTML = createRandomIngredientsList(randomMeal);
    recipe.innerText = getRandomRecipe(randomMeal);
    video.onclick = () => {
      videoRandomReroute(randomMeal);
    };
    // Show the modal
    modal.style.display = "block";
}
  
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
  
  function getRandomRecipe(randomMeal) {
    return randomMeal.strInstructions;
  }
  
  function videoRandomReroute(randomMeal) {
    window.location.href = randomMeal.strYoutube;
  }
  
  closeModal.onclick = function () {
    modal.style.display = "none";
  };
  
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  
  

