'use strict';

const loginScreen = document.querySelector('.login_screen');
const contentAll = document.querySelector('.content_all');
const loginForm = document.getElementById('login_form');
const logoutButton = document.getElementById('logout');
const depositButton = document.getElementById('deposit');
const withdrawButton = document.getElementById('withdraw');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const userName = document.getElementById('user_name');
const passWord = document.getElementById('pass_word');
const balance = document.getElementById('balance');
const containerMovements = document.querySelector('.movements');
const sortButton = document.querySelector('.btn--sort');
const transferAmount = document.getElementById('amount');

///////////////////////////////////////////////////////////////////////////
///////////////////////////// DARK MODE FUNCTIONALITY /////////////////////
///////////////////////////////////////////////////////////////////////////

// Check if dark mode is stored in localStorage
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
}

// Toggle dark mode on button click
darkModeToggle.addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');

  // Save the user's preference
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
});

///////////////////////////////////////////////////////////////////////////
/////////////////////////////SAMPLE ACCOUNTS///////////////////////////////
///////////////////////////////////////////////////////////////////////////
const accounts = [
  {
    owner: 'Paul Macalaguim',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    password: 1111,
  },
  {
    owner: 'Jane Doe',
    movements: [500, 340, -150, 790, -321, 1000, 85, -30],
    password: 2222,
  },
];

let currentAccount;
let sort = false;

////////////////////////////////////////////////////////////////
///////////////////////DISPLAY MOVEMENT/////////////////////////
////////////////////////////////////////////////////////////////

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  let movs;
  if (sort) {
    movs = [...movements].sort((a, b) => a - b);
  } else {
    movs = movements;
  }

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov} PHP</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

////////////////////////////////////////////////////////////////
////////////////////////DISPLAY BALANCE/////////////////////////
////////////////////////////////////////////////////////////////

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  balance.textContent = `PHP ${acc.balance}`;
};

////////////////////////////////////////////////////////////////
////////////////////////DISPLAY SUMARRY/////////////////////////
////////////////////////////////////////////////////////////////

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);
  labelSumIn.textContent = `${incomes} PHP`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((sum, mov) => sum + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} PHP`;
};

////////////////////////////////////////////////////////////////
////////////////////////UPDATE THE UI///////////////////////////
////////////////////////////////////////////////////////////////

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

////////////////////////////////////////////////////////////////
/////////////////////// EVENT - LOG IN /////////////////////////
////////////////////////////////////////////////////////////////

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) =>
      acc.owner === userName.value && acc.password === Number(passWord.value)
  );
  if (currentAccount) {
    loginScreen.style.display = 'none';
    contentAll.style.display = 'flex';
    updateUI(currentAccount);
  } else {
    alert('Invalid username or password');
    userName.value = '';
    passWord.value = '';
  }
});

////////////////////////////////////////////////////////////////
/////////////////////// EVENT - LOG OUT ////////////////////////
////////////////////////////////////////////////////////////////

logoutButton.addEventListener('click', function () {
  const logoutConfirmation = prompt(
    'Are you sure you want to logout? (Yes or No)'
  )
    .toLowerCase()
    .trim();
  if (logoutConfirmation === 'yes') {
    contentAll.style.display = 'none';
    loginScreen.style.display = 'flex';
    userName.value = '';
    passWord.value = '';
    alert('Thank you for using the app! Bye!');
  } else if (logoutConfirmation === 'no') {
    alert('Continue using the app...');
  } else {
    alert('Invalid Input!');
  }
});

////////////////////////////////////////////////////////////////
///////////////////////// EVENT - SORT /////////////////////////
////////////////////////////////////////////////////////////////

sortButton.addEventListener('click', function () {
  if (sort) {
    sort = false;
  } else {
    sort = true;
  }
  displayMovements(currentAccount.movements, sort);
});

////////////////////////////////////////////////////////////////
///////////////// EVENT - DEPOSIT / WITHDRAW ///////////////////
////////////////////////////////////////////////////////////////

//Deposit
depositButton.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(transferAmount.value);

  if (amount > 0) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
    transferAmount.value = '';
    alert(`Deposit successful! Php ${amount} has been added to your account.`);
  } else {
    alert('Please enter a valid amount');
    transferAmount.value = '';
  }
});

//Withdraw
withdrawButton.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(transferAmount.value);

  if (amount > 0 && amount <= currentAccount.balance) {
    currentAccount.movements.push(-amount);
    updateUI(currentAccount);
    alert(
      `Withdrawal successful! Php ${amount} has been deducted from your account`
    );
    transferAmount.value = '';
  } else if (amount > currentAccount.balance) {
    alert('Insufficient balance');
    transferAmount.value = '';
  } else {
    alert('Please enter a valid amount');
    transferAmount.value = '';
  }
});
