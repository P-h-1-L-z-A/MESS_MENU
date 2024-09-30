// Static menu data
const menuData = {
  "Monday": {
    "breakfast": ["Poha", "Jalebi" ,"Eggs", "Tea/Coffee"],
    "lunch": ["Aloo Baigan","Kala Chana","Rice", "Dal", "Rasam"],
    "snack": ["Mirchi Pakoda", "Tea"],
    "dinner": ["Mix Veg", "Dal Makhani", "Rice"]
  },
  "Tuesday": {
    "breakfast": ["Idli", "Sambar", "Coconut Chutney","Tea/Coffee"],
    "lunch": ["Lauki Chana", "White Matar Aloo","Rice", "Dal", "Rasam"],
    "snack": ["Palak Pakora", "Tea"],
    "dinner": ["Bhindi Aloo", "Rajma","Rice"]
  },
  "Wednesday": {
    "breakfast": ["Pav Bhaji", "Tea/Coffee"],
    "lunch": ["Aloo Palak","Seasonal Veg","Rice", "Dal", "Rasam"],
    "snack": ["Samosa", "Tea"],
    "dinner": ["Matar Paneer", "Kadai Paneer","Rice"]
  },
  "Thursday": {
    "breakfast": ["Sambhar", "Uttapam","Coconut Chutney", "Tea/Coffee"],
    "lunch": ["Aloo Jeera", "Kadai Paneer", "Dal", "Rice" ,"Rasam"],
    "snack": ["Bhel/Sandwich", "Tea"],
    "dinner": ["Mix Sabji", "Dal", "Rice"]
  },
  "Friday": {
    "breakfast": ["Puri Bhaji", "Chole Bhature", "Tea/Coffee"],
    "lunch": ["Mix Veg", "Grains Mix Sabji", "Rice", "Dal" ,"Rasam"],
    "snack": ["Pasta", "Tea"],
    "dinner": ["Baigan Masala", "Dal", "Rice"]
  },
  "Saturday": {
    "breakfast": ["Dosa", "Sambar","Cocunet Chutney", "Tea/Coffee"],
    "lunch": ["Chole","Khichdi","Aloo Chokha"],
    "snack": ["Toast", "Tea"],
    "dinner": ["Green Matar Aloo", "Dal", "Rice"]
  },
  "Sunday": {
    "breakfast": ["Aloo Paratha", "Dahi", "Tea/Coffee"],
    "lunch": ["Veg  Biryani", "Raita", "Veg Kolhapuri"],
    "snack": ["Biscuit", "Tea"],
    "dinner": ["Matar Paneer/Kadai Paneer", "Dal", "Rice"]
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
