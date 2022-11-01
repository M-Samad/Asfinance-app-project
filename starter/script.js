'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Samad Hashmi',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-10-28T23:36:17.929Z',
    '2022-10-27T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'hi-IN', // de-DE
};

const account2 = {
  owner: 'Zoya Fatima',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const done = function () {
  // document.querySelector('body').style.display = 'none';
  // document.querySelector('.done').style.opacity = 100;
  document.querySelector('.done').style.display = 'block';

  document.querySelector('.done').style.transition = 'all 0.3s';
  setTimeout(function () {
    // document.querySelector('body').style.display = 'block';
    // document.querySelector('.done').style.transition = 1;
    // document.querySelector('.done').style.opacity = 0;
    document.querySelector('.done').style.display = 'none';
  }, 1000);
};

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const year = date.getFullYear();
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const day = `${date.getDate()}`.padStart(2, 0);

    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div><div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // in each call,print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // when 0 seconds ,stops timer and logout user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    //decrese time
    time--;
  };
  // set time to 5 minutes

  let time = 300;
  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// Fake Always login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// Experimenting API

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    document.querySelector('.card').style.display = 'none';
    document.querySelector('body').style.transform = 1;
    containerApp.style.opacity = 100;

    // Create current Date
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const year = now.getFullYear();
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const date = `${now.getDate()}`.padStart(2, 0);
    // const hour = `${now.getHours()}.`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${date}/${month}/${year},${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    done();

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      done();

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
    done();
    setTimeout(function () {
      document.querySelector('.card').style.display = 'block';
    }, 1000);
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// console.log(23.0 === 23);
// console.log(0.1 + 0.2);
// console.log(0.1 + 0.2 === 0.3);

// // conversion ----
// console.log(Number('23'));
// console.log(+'23');

// // Parsing ----
// console.log(Number.parseInt('434asf5'));
// console.log(Number.parseInt('asf44sssss'));

// console.log(Number.parseFloat('4.53dsd'));
// console.log(parseFloat('4.53dsd'));

// // Checking if value is not a number ----
// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20x'));
// console.log(Number.isNaN(23 / 0));

// // Checking if value is number ----
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(20 / 0));

// console.log(Number.isInteger(23));
// console.log(Number.isInteger(23.0));
// console.log(Number.isInteger(23 / 0));

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(Math.max(2, 6, 8, 78, 6));
// console.log(Math.max(2, 6, '345', 78, 6));
// console.log(Math.max(2, 6, '6f4', 78, 6));

// console.log(Math.min(2, 6, 8, 78, 6));

// console.log(Math.PI * Number.parseFloat('4fbhg') ** 2);

// // console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
// console.log(randomInt(10, 20));

// // Rounding integers ----
// console.log(Math.trunc(23.3));

// console.log(Math.round(23.3));
// console.log(Math.round(23.9));

// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));

// console.log(Math.floor(23.3));
// console.log(Math.floor(23.9));

// // difference btw trunc and floor ---
// console.log(Math.trunc(-23.54));
// console.log(Math.floor(-23.54));

// // Rounding Decimals ----
// console.log((2.53).toFixed(0));
// console.log((2.53).toFixed(1));
// console.log((2.53).toFixed(2));
// console.log(+(2.53).toFixed(3));

// Remainder operator ----
// console.log(5 % 2);
// console.log(5 / 2);

// console.log(8 % 2);
// console.log(8 / 2);

// const isEven = n => n % 2 === 0;
// console.log(isEven(4));
// console.log(isEven(43));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (raw, i) {
//     if (i % 2 === 0) raw.style.backgroundColor = 'grey';
//   });
// });

// // Numeric seperator ----
// const diameter = 234_244_343_434;
// console.log(diameter);

// const trnsfr1 = 15_56;
// const trnsfr2 = 1_556;
// console.log(trnsfr1);
// console.log(trnsfr2);

// console.log(Number('3434_566'));
// console.log(parseInt('434gfg'));
// console.log(parseFloat('34343.554dfd'));

// // Big Int ----
// console.log(2 ** 53);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(2 ** 53 - 1);
// console.log(2 ** 53 + 995464564565466);

// console.log(123456789123456789n);
// console.log(BigInt(123456789123456789));

// // Big int operation ----
// console.log(10000n + 10000n);
// console.log(
//   66456666654656645646465666456456456456464565n * 45454545454545454545454n
// );

// const huge = 5454545454545454545453235552522352n;
// const num = 343;
// console.log(huge * BigInt(num));

// // console.log(Math.sqrt(huge)); // Math operation does not works on Bigint.

// // Big int exception ----
// console.log(20n > 15);
// console.log(20n == 20); // true because == operator does type coersion (that means automactically convert types of both value to similar type.)
// console.log(20n === 20); // false because === operator doesn't do type coersion (that means does not automactically convert types of both value to similar type.)
// console.log(typeof 20n);
// console.log(20n == '20');
// console.log(huge + ' is really big!!!');

// // Big int Division ----
// console.log(12n / 3n);
// console.log(10 / 3);

// Dates and times ----

// Create A Date ---
// const now = new Date();
// console.log(now);
// console.log(new Date('Fri Oct 28 2022 16:54:32 GMT+0530'));
// console.log(new Date('December 25,2015'));
// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2032, 11, 15, 23, 5, 7));
// console.log(new Date(2022, 11, 32));

// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));

// Working with dates ----
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.getMilliseconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(Date.now());
// future.setFullYear(2040);
// console.log(future);

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

// const daysPassed = function (bigDate, smallDate) {
//   const sDate = +smallDate;
//   const bDate = +bigDate;
//   return (bDate - sDate) / 1000 / 60 / 60 / 24;
// };
// const daysPass = daysPassed(new Date(2022, 11, 12), new Date(2022, 11, 10));
// console.log(daysPass);

// const calcDaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

// const daysPasses = calcDaysPassed(
//   new Date(2022, 11, 12),
//   new Date(2022, 11, 10)
// );

// console.log(daysPasses);

// Internasionalizing Numbers ---
// const option = {
//   style: 'currency',
//   unit: 'mile-per-hour',
//   currency: 'INR',
// };
// const num = 335355.45;
// console.log(new Intl.NumberFormat('en-IN', option).format(num));
// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language, option).format(num)
// );

//Timers ----

// set timeout ---

// const ingredients = ['olives', 'spinach'];
// setTimeout(() => console.log('fffsfs'), 3000);
// console.log('fdvdvvdv');
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
//   3000,
//   ...ingredients
// );
// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// set timeinterval ---

// setInterval(() => {
//   const now = new Date();
//   console.log(now);
// }, 1000);

// setInterval(function () {
//   const date = new Date();
//   const hours = date.getHours();
//   const min = date.getMinutes();
//   const second = date.getSeconds();
//   console.log(`${hours}:${min}:${second}`);
// }, 1000);
