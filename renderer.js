const toggleCalendarButton = document.getElementById('toggle-calendar');
const monthsContainer = document.getElementById('months');
const daysContainer = document.getElementById('days');
const goBackButton = document.getElementById('go-back');
const foodNameInput = document.getElementById('food-name');
const caloriesInput = document.getElementById('calories');
const mealTypeSelect = document.getElementById('meal-type');
const addFoodButton = document.getElementById('add-food');
const foodListContainer = document.getElementById('food-list');
const calendarContainer = document.querySelector('.calendar-container');

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_IN_MONTH = {
  January: 31, February: 28, March: 31, April: 30, May: 31, June: 30,
  July: 31, August: 31, September: 30, October: 31, November: 30, December: 31
};

let foodLogs = {};
calendarContainer.style.display = 'none';

function showMonths() {
  monthsContainer.innerHTML = '';
  MONTHS.forEach((month) => {
    const monthElement = document.createElement('div');
    monthElement.textContent = month;
    monthElement.onclick = () => showDays(month);
    monthsContainer.appendChild(monthElement);
  });
}

function showDays(month) {
  daysContainer.innerHTML = '';
  const numberOfDays = DAYS_IN_MONTH[month];

  for (let day = 1; day <= numberOfDays; day++) {
    const dayElement = document.createElement('div');
    dayElement.textContent = day;
    dayElement.onclick = () => selectDay(month, day);
    daysContainer.appendChild(dayElement);
  }

  monthsContainer.style.display = 'none';
  daysContainer.style.display = 'grid';
  goBackButton.style.display = 'block';
}

goBackButton.addEventListener('click', () => {
  daysContainer.style.display = 'none';
  monthsContainer.style.display = 'grid';
  goBackButton.style.display = 'none';

  foodListContainer.innerHTML = '';
  foodListContainer.style.display = 'none';
});

toggleCalendarButton.addEventListener('click', () => {
  const isHidden = window.getComputedStyle(calendarContainer).display === 'none';

  if (isHidden) {
    calendarContainer.style.display = 'flex';
    showMonths();
  } else {
    calendarContainer.style.display = 'none';
  }
});

function selectDay(month, day) {
  const selectedDate = `2025-${String(MONTHS.indexOf(month) + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const logs = foodLogs[selectedDate] || [];

  foodListContainer.innerHTML = '';

  if (logs.length === 0) {
    foodListContainer.innerHTML = 'No food logs for this day.';
    foodListContainer.classList.add('no-logs');
  } else {
    foodListContainer.classList.remove('no-logs');
    logs.forEach(({ meal, foodName, calories }) => {
      const foodItem = document.createElement('div');
      foodItem.textContent = `${meal} - ${foodName}: ${calories} kcal`;
      foodListContainer.appendChild(foodItem);
    });
  }

  addFoodButton.onclick = () => addFoodToLog(selectedDate);
  foodListContainer.style.display = 'block';
}

function addFoodToLog(date) {
  const foodName = foodNameInput.value.trim();
  const calories = parseInt(caloriesInput.value, 10);
  const mealType = mealTypeSelect.value;

  if (foodName && !isNaN(calories)) {
    if (!foodLogs[date]) {
      foodLogs[date] = [];
    }

    foodLogs[date].push({
      foodName,
      calories,
      meal: mealType
    });

    foodNameInput.value = '';
    caloriesInput.value = '';
    mealTypeSelect.value = 'Breakfast';

    const [year, month, day] = date.split('-');
    selectDay(MONTHS[parseInt(month, 10) - 1], parseInt(day, 10));
  } else {
    alert('Please enter a valid food name and calorie count.');
  }
}
