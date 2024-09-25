// Static menu data
const menuData = {
  "Monday": {
    "breakfast": ["Poha", "Boiled Eggs", "Tea/Coffee"],
    "lunch": ["Rice", "Dal", "Paneer Curry", "Chapati", "Salad"],
    "snack": ["Samosa", "Tea"],
    "dinner": ["Rice", "Chicken Curry", "Chapati", "Ice Cream"]
  },
  "Tuesday": {
    "breakfast": ["Idli", "Sambar", "Tea/Coffee"],
    "lunch": ["Rice", "Rajma", "Mix Veg", "Roti", "Papad"],
    "snack": ["Bread Pakora", "Tea"],
    "dinner": ["Rice", "Egg Curry", "Chapati", "Gulab Jamun"]
  },
  "Wednesday": {
    "breakfast": ["Paratha", "Curd", "Tea/Coffee"],
    "lunch": ["Rice", "Chole", "Mix Veg", "Chapati", "Salad"],
    "snack": ["Vada Pav", "Tea"],
    "dinner": ["Rice", "Fish Curry", "Chapati", "Kheer"]
  },
  "Thursday": {
    "breakfast": ["Upma", "Boiled Eggs", "Tea/Coffee"],
    "lunch": ["Rice", "Matar Paneer", "Chapati", "Salad"],
    "snack": ["Pakoras", "Tea"],
    "dinner": ["Rice", "Mutton Curry", "Chapati", "Ice Cream"]
  },
  "Friday": {
    "breakfast": ["Bread Toast", "Butter", "Tea/Coffee"],
    "lunch": ["Rice", "Butter Chicken", "Chapati", "Salad"],
    "snack": ["Bhel Puri", "Tea"],
    "dinner": ["Rice", "Prawn Curry", "Chapati", "Gulab Jamun"]
  },
  "Saturday": {
    "breakfast": ["Dosa", "Sambar", "Tea/Coffee"],
    "lunch": ["Rice", "Chicken Curry", "Chapati", "Salad"],
    "snack": ["Samosa", "Tea"],
    "dinner": ["Rice", "Paneer Tikka", "Chapati", "Kheer"]
  },
  "Sunday": {
    "breakfast": ["Pancakes", "Fruit Salad", "Tea/Coffee"],
    "lunch": ["Rice", "Fish Curry", "Chapati", "Salad"],
    "snack": ["Pakoras", "Tea"],
    "dinner": ["Rice", "Beef Curry", "Chapati", "Ice Cream"]
  }
};

// Function to update the menu based on selected day
function fetchMenu(day) {
  const menuDiv = document.getElementById('menu');
  menuDiv.innerHTML = ''; // Clear the previous menu
  
  const mealCategories = ['breakfast', 'lunch', 'snack', 'dinner'];
  mealCategories.forEach(mealType => {
    const mealDiv = document.createElement('div');
    mealDiv.classList.add('meal');
    mealDiv.setAttribute('id', mealType); // Set ID for scrolling
    
    const mealTitle = document.createElement('h2');
    mealTitle.innerText = mealType.charAt(0).toUpperCase() + mealType.slice(1);
    mealDiv.appendChild(mealTitle);
    
    const mealList = document.createElement('ul');
    menuData[day][mealType].forEach(item => {
      const listItem = document.createElement('li');
      listItem.innerText = item;
      mealList.appendChild(listItem);
    });
    
    mealDiv.appendChild(mealList);
    menuDiv.appendChild(mealDiv);
  });
}

// Function to update button text based on screen width
function updateButtonLabels() {
  const buttons = document.querySelectorAll('.day-selector button');
  if (window.innerWidth <= 480) {
    buttons.forEach(button => {
      const day = button.getAttribute('data-day');
      button.innerText = getDayAbbreviation(day); // Set abbreviation
    });
  } else {
    buttons.forEach(button => {
      const day = button.getAttribute('data-day');
      button.innerText = day; // Restore full day name
    });
  }
}

// Function to get day abbreviation (to handle multi-character abbreviations)
function getDayAbbreviation(day) {
  const abbreviations = {
    "Monday": "M",
    "Tuesday": "T",
    "Wednesday": "W",
    "Thursday": "Th",
    "Friday": "F",
    "Saturday": "Sa",
    "Sunday": "Su"
  };
  return abbreviations[day] || day.charAt(0);
}

// Function to determine the next meal based on current time// Function to determine the next meal based on current time
function getNextMeal() {
  const now = new Date();
  const currentHour = now.getHours();
  let nextMeal = '';

  if (currentHour <9) {
    nextMeal = 'breakfast';
  } else if (currentHour < 14) {
    nextMeal = 'lunch';
  } else if (currentHour < 18) {
    nextMeal = 'snack';
  } else {
    nextMeal = 'dinner';
  }

  return nextMeal;
}

// Function to highlight the next meal and scroll to it
function scrollToNextMeal() {
  const nextMeal = getNextMeal();
  
  // First, remove any existing highlight class
  const previouslyHighlighted = document.querySelector('.meal.highlight-next-meal');
  if (previouslyHighlighted) {
    previouslyHighlighted.classList.remove('highlight-next-meal');
  }

  // Now, apply the highlight to the next meal
  if (nextMeal) {
    const mealElement = document.getElementById(nextMeal);
    if (mealElement) {
      mealElement.classList.add('highlight-next-meal');  // Highlight the next meal
      mealElement.scrollIntoView({ behavior: 'smooth', block: 'start' });  // Scroll to it
    }
  }
}

// Function to automatically select the current day and scroll to the next meal
function autoSelectDayAndMeal() {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date();

  // Get current day of the week
  const currentDay = daysOfWeek[now.getDay()];

  // Fetch the menu for the current day
  fetchMenu(currentDay);

  // Highlight the current day button
  const dayButton = document.querySelector(`button[data-day="${currentDay}"]`);
  if (dayButton) {
    dayButton.classList.add('active-day');
  }

  // Scroll to the next meal and highlight it, but only if the current day has not been scrolled yet
  const lastAutoScrollDay = localStorage.getItem('lastAutoScrollDay');

  if (lastAutoScrollDay !== currentDay) {
    scrollToNextMeal();  // Scroll and highlight the next meal
    localStorage.setItem('lastAutoScrollDay', currentDay);  // Mark that auto-scroll was done for the day
  }

  // Add event listeners for manual day change
  const buttons = document.querySelectorAll('.day-selector button');
  buttons.forEach(button => {
    button.addEventListener('click', function () {
      const selectedDay = this.getAttribute('data-day');
      
      // Remove 'active-day' class from all buttons
      buttons.forEach(btn => btn.classList.remove('active-day'));
      // Add 'active-day' class to clicked button
      this.classList.add('active-day');
      
      // Fetch menu for selected day
      fetchMenu(selectedDay);
      
      // Remove highlight from all meals
      const highlightedMeals = document.querySelectorAll('.meal.highlight-next-meal');
      highlightedMeals.forEach(meal => meal.classList.remove('highlight-next-meal'));
      
      // If the selected day is the current day, reapply the highlight
      if (selectedDay === currentDay && lastAutoScrollDay !== currentDay) {
        scrollToNextMeal();
        localStorage.setItem('lastAutoScrollDay', currentDay);
      }
    });
  });
}


// Initial setup on page load
window.onload = () => {
  updateButtonLabels();
  autoSelectDayAndMeal();
};

// Update button labels on window resize
window.onresize = updateButtonLabels;
