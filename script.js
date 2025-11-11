// Static menu data
const menuData = {
  "Monday": {
    "breakfast": ["Idli", "Sambhar" ,"Chutney","Fruit/Eggs/Bread Butter", "Milk/Tea/Coffee"],
    "lunch": ["Chana Pattagobi","Kala Chana", "Dal/Rice", "Rasam/Salad/Curd"],
    "snack": ["Pongulu", "Tea/Coffee/Milk"],
    "dinner": ["Matar Aloo (Dry)", "Jeera Rice/Dal Makhni", "Jalebi"]
  },
  "Tuesday": {
    "breakfast": ["Onion Paratha", "Tomato Chutney","Milk/Tea/Coffee"],
    "lunch": ["Sprout Curry", "Aloo Jeera", "Jeera Rice/Dal", "Rasam/Salad/Curd"],
    "snack": ["Pakora", "Tea/Coffee/Milk"],
    "dinner": ["Aloo Bhindi (Dry)", "Matar Rice/Dal","Custard Fruit"]
  },
  "Wednesday": {
    "breakfast": ["Pav Bhaji", "Onion/Lemon" , "Milk/Tea/Coffee"],
    "lunch": ["Pumpkin Gravy","Matar-Cauliflower","Matar Rice/Dal", "Rasam/Salad/Curd"],
    "snack": ["Samosa", "Tea/Coffee/Milk"],
    "dinner": ["Kadai Paneer", "Jeera Rice/Dal","Bamboo Sewai dry"]
  },
  "Thursday": {
    "breakfast": ["3 Pieces Medu Vada", "Sambhar", "Milk/Tea/Coffee"],
    "lunch": ["Aloo Jeera", "Kadai Paneer", "Dal", "Rice" ,"Rasam/Salad/Curd"],
    "snack": ["Hakka Noodles", "Tea/Coffee/Milk"],
    "dinner": ["White Kidney beans", "Fried Rice", "Schezwan Chutney", "Rice Kheer"]
  },
  "Friday": {
    "breakfast": ["Misal Pav", "Onion/Lemon", "Milk/Tea/Coffee"],
    "lunch": ["Kidney Bean curry", "Aloo Palak/Methi", "Tomato Rice" ,"Rasam/Salad"],
    "snack": ["Wet-Bhel", "Tea/Coffee/Milk"],
    "dinner": ["White matar", "Veg Biryani","Boondi Raita", "Sabudana Kheer"]
  },
  "Saturday": {
    "breakfast": ["Masala Dosa", "Sambar", "Milk/Tea/Coffee"],
    "lunch": ["Chhole Sabji","Spicy Dry Khichdi","Boondi Raita","Aloo Chokha"],
    "snack": ["Pasta", "Tea/Coffee/Milk"],
    "dinner": ["Aloo Bhujia sabji", "Jeera Rice/Dal Tadka", "Balu Shahi"]
  },
  "Sunday": {
    "breakfast": ["Aloo Paratha", "Dahi", "Milk/Tea/Coffee"],
    "lunch": ["Aloo Matar", "Raita", "Veg Biryani"],
    "snack": ["Aloo Pakoda", "Tea/Coffee/Milk"],
    "dinner": ["Paneer Matar", "Puri", "Matar Rice/Dal","Gulab Jamun"]
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


  document.querySelectorAll('.meal').forEach(meal => {
    meal.classList.remove('highlight-next-meal');
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

// Function to get the current time in the desired time zone (for example, 'Asia/Kolkata')
// Function to get the current time in the desired time zone (for example, 'Asia/Kolkata')
function getCurrentTimeInTimeZone(timeZone) {
  const options = {
    timeZone: timeZone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  };
  const formatter = new Intl.DateTimeFormat([], options);
  const parts = formatter.formatToParts(new Date());
  const hourPart = parts.find(part => part.type === 'hour');
  return parseInt(hourPart.value, 10);
}

// Determine the next meal based on the time
function getNextMeal() {
  const currentHour = getCurrentTimeInTimeZone('Asia/Kolkata'); // Adjust time zone here
  if (currentHour < 10) return 'breakfast';
  if (currentHour < 14) return 'lunch';
  if (currentHour < 18) return 'snack';
  return 'dinner';
}

// Scroll to and highlight the next meal
function scrollToNextMeal() {
  const nextMeal = getNextMeal();
  const mealElement = document.getElementById(nextMeal);
  if (mealElement) {
    mealElement.classList.add('highlight-next-meal');
    mealElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Auto-select the current day based on the time
function autoSelectDay() {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = daysOfWeek[new Date().getDay()];

  // Highlight the current day button
  const dayButton = document.querySelector(`button[data-day="${currentDay}"]`);
  if (dayButton) dayButton.classList.add('active-day');

  // Fetch and display the menu for the current day
  fetchMenu(currentDay);
}

  // Reset any previously highlighted meals
  document.querySelectorAll('.meal').forEach(meal => {
    meal.classList.remove('highlight-next-meal');
  });

  // Optionally, update the displayed menu content for the selected day


// Add event listeners for day selection
document.querySelectorAll('.day-selector button').forEach(button => {
  button.addEventListener('click', (event) => {
    // Remove 'active-day' class from all buttons
    document.querySelectorAll('.day-selector button').forEach(btn => btn.classList.remove('active-day'));

    // Highlight the selected day
    const selectedDay = event.target.getAttribute('data-day');
    event.target.classList.add('active-day');

    // Fetch the menu for the selected day
    fetchMenu(selectedDay);
  });
});

// Auto-select the day and scroll to the next meal on the first load
window.addEventListener('DOMContentLoaded', () => {
  autoSelectDay();
  scrollToNextMeal();
});

