const mealsEl = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals')
const searchTerm = document.getElementById('searchTerm');
const searchBtn = document.getElementById('search');
const mealPopup = document.getElementById('meal-popup')
const popupCloseBtn = document.getElementById('close-popup');
const mealInfoEl = document.getElementById('meal-info')

getRandomMeal();
fetchFavMeals();
// addMealFav();
async function getRandomMeal(){

const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
const respData = await resp.json();
const randomMeal = respData.meals[0];
console.log(randomMeal);

addMeal(randomMeal,true);
}


async function getMealById(id){

                 const resp =await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+id);
                 const respData = await resp.json();
                 const meal = respData.meals[0];
                 return meal ;
}


async function getMealBySearch(term){
                  const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+term);
                  const respData = await resp.json();
                  const meals = respData.meals;
                  return meals;
}

function addMeal(mealData,random = false){
// console.log(mealData);
const meal = document.createElement('div');
meal.classList.add('meal');

meal.innerHTML = `
<div class="meal-header">
${random ? `<span class="random">Random Recipe</span>` : ''}
            <img src = "${mealData.strMealThumb}" alt= "${mealData.strMeal}">
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn"><i class="fas fa-heart"></i></button>
    </div>
`;

mealsEl.appendChild(meal);

const btn = meal.querySelector(".meal-body .fav-btn");
btn.addEventListener("click", () => {
if(btn.classList.contains('active')){
    removeMealLS(mealData.idMeal);
    btn.classList.remove("active");

}else{
    addMealLS(mealData.idMeal);
    btn.classList.add("active")
}
fetchFavMeals();

});
meal.addEventListener('click', (event) =>{

    let btnc = event.target.closest('button');
    if(!btnc){
    showMealInfo(mealData);
    }
});
}

function addMealLS(mealId){
const mealIds = getMealLS();

localStorage.setItem('mealIds',JSON.stringify([...mealIds,mealId]));

}

function getMealLS(){
const mealIds = JSON.parse(localStorage.getItem('mealIds'));
return mealIds === null ? [] : mealIds;
}


function removeMealLS(mealId){
     const mealIds = getMealLS();
    localStorage.setItem('mealIds',JSON.stringify(mealIds.filter(id => id !== mealId)));
}

async function fetchFavMeals(){

        favoriteContainer.innerHTML = "";//clean the container

            const mealIds = getMealLS();
            // const meals = [];
            for(let i = 0; i < mealIds.length; i++){
                const mealId = mealIds[i];
            let meal = await getMealById(mealId);
            addMealFav(meal);
            }
}




function addMealFav(mealData){

    // console.log(mealData);
    const favMeal = document.createElement('li');

    
    favMeal.innerHTML = `
    <img src = "${mealData.strMealThumb}" alt= "${mealData.strMeal}">
    <span>${mealData.strMeal}</span>

    <button class ="clear" id="btnli"><i class = "fas fa-window-close"></i></button>
    `;

     const btn = favMeal.querySelector('button');
     btn.addEventListener('click', () => {
        removeMealLS(mealData.idMeal);
        fetchFavMeals();
     })
    
    favoriteContainer.appendChild(favMeal);
    favMeal.addEventListener('click', (event) => {
        let    btnc = event.target.closest('button')
        if(!btnc){
        
        showMealInfo(mealData);}
    
    });
    }



    searchBtn.addEventListener('click' ,async () => {

            const search = searchTerm.value;
            const meals = await getMealBySearch(search) ;
            mealsEl.innerHTML = '';//clearing container
            if(meals)
            meals.forEach((meal) => {
                        addMeal(meal);
            })
           ;

    });


    popupCloseBtn.addEventListener('click', () => {
        mealPopup.classList.add("hidden");
    });


    function showMealInfo(mealData){
        const ingredients = [];

        // clean it up
        mealInfoEl.innerHTML = '';
        //update the meal info
        const mealEl = document.createElement('div');
        mealInfoEl.appendChild(mealEl);


        mealEl.innerHTML = `<h1>Meal Title</h1>
        <img src =" ${mealData.strMealThumb}" alt = " ${mealData.strMealThumb}">
        <p>${mealData.strInstructions} </p>
        <h3>Ingredients:</h3>
        <ul> ${ingredients.map(ing => `<li>${ing}</li>`).join(" ")}
        </ul>
        `;

        mealPopup.classList.remove('hidden');//show popup content

        // get Ingeredients and measures
        
    for(let i = 1; i <= 20 ; i++){
            if(mealData["strIngredient" + i]){
                ingredients.push(`${mealData['strIngredient'+i]} - ${mealData['strMeasure'+i]}`)

            }else{
                break;
            }
            console.log(ingredients);
    }   
    }