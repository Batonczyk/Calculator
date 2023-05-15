document.addEventListener('DOMContentLoaded', function () {
  const keys = document.querySelectorAll('.key'); // всі кнопки
  const keysValue = document.querySelectorAll('.key span');
  const displayOne = document.querySelector('.display__content-one'); // пеший інпут 
  const displayTwo = document.querySelector('.display__content-two'); // інпут другий з виводом результату вичтслення іпута 1

  let result = ''; // пуста строка над якою робляться усі маніпуляці і записується кінцеве значення 

  for (let key of keys) { // перебираю усі кнопки 
    let btn = key.dataset.key; // записую в змінну усі кнопки з дата атрибутом key
    key.addEventListener('click', function () { // на кожну кнопку навішую клік
      if (btn === 'clear') { // якщо нашо дата атрибут це clean - то:
        result = ''; // чищу string result
        displayOne.innerHTML = ''; // чищу периший інпут
        displayTwo.innerHTML = ''; // чищу другий інпут - після цього на екрані буде пусто
      } else if (btn === 'Backspace') { // Якщо датаатрибут це backspace - то видаляю останій елемент
        result = result.slice(0, -1); // видаляю останій елемент
        displayOne.innerHTML = CleanValue(result); // оновлюю наш інпут (екран калькулятора)
      } else if (btn === '=') { // якщо  дата атрибут це =
        let val = eval(percent(result)); // то в змінну val - записую змінну eval - котра робить вичеслення введених вимволів
        displayTwo.innerHTML = CleanOutValue(val); // оновлюю displayTwo
      } else if (btn === 'breckets') { // дуждки 
        if (result.indexOf('(') === -1 || // якщо в строці немає знаку ( , то відкрию дужку або
          result.indexOf('(') !== -1 && // в строці є знак ( 
          result.indexOf(')') !== -1 && // і в строці є знак ) і 
          result.lastIndexOf('(') < result.lastIndexOf(')')) { // останій елемент в строці це ( котра є перед знаком ), то тоді можна додати наступну відкриваючу 
          result += '('; // якщо після закриваючої дужки немаж відкриваючої, то додам відкриваючу
        } else if (result.indexOf('(') !== -1 && // Якщо є відкриваюча ( і немає закриваючої ), то додаю закриваючу або
          result.indexOf(')') === -1 ||
          result.indexOf('(') !== -1 && // якщо є (
          result.indexOf(')') !== -1 && // і є )
          result.lastIndexOf('(') > result.lastIndexOf(')')) { // і якщо останій елемент це (
          result += ')'; // то додаю )
        }
        displayOne.innerHTML = CleanValue(result); // оновлюю запис в інпуті першому
      } else {
        if (Validate(btn)) { // валідація символів
          result += btn; // додаю кожну кнопку по кліку в строку result
          displayOne.innerHTML = CleanValue(result); // оновлюю перишй екран інпут
        }
      }

    });
  }
  document.addEventListener('keydown', pressKey); // Пишемо з клавіатури цифри

  function pressKey(e) {
    const press = e.key;
    for (let button of keys) {
      const btn = button.dataset.key;
      if(press === btn){
        button.click();
        return
      }else if(press === 'Enter'){
        let val = eval(percent(result));
        displayTwo.innerHTML = CleanOutValue(val);
      }
    }
  }

  function CleanValue(input) { // функція правильного виводу на екран кнопок
    let inputArray = input.split(''); // аргумент (це наша строка result) роблю масив

    for (let i = 0; i < inputArray.length; i++) { // пробігаю масив
      if (inputArray[i] === '*') { // якщо в строці є знак *
        inputArray[i] = ` <span class="operator">x</span> `; // то заміняю його на екрані на 'х'... аналогічно з іншими 
      } else if (inputArray[i] === '/') {
        inputArray[i] = `<span class="operator">÷</span>`;
      } else if (inputArray[i] === '+') {
        inputArray[i] = `<span class="operator">+</span>`;
      } else if (inputArray[i] === '-') {
        inputArray[i] = `<span class="operator">-</span>`;
      } else if (inputArray[i] === '(') {
        inputArray[i] = `<span class="breckets">(</span>`;
      } else if (inputArray[i] === ')') {
        inputArray[i] = `<span class='breckets'>)</span>`;
      } else if (inputArray[i] === '%') {
        inputArray[i] = `<span class="percent">%</span>`
      }
    }
    return inputArray.join(''); // масив повертаю в строку
  }

  function CleanOutValue(out) { // функція форматування строки. Розділя тисячні знаки комою наприкла число 1000000 буде 1,000,000
    let outString = out.toString(); // строка вичелення val переробляється в строку 
    let decimal = outString.split('.')[1]; // в змінну записую строку і перероблю її в масив і розділяю крапкою ы записую десятичний елемент наприкла число 1236.56 то запишу 56 в decimal
    console.log(decimal);
    outString = outString.split('.')[0]; // оновлюю outString = записую тисячну частину якщо вона буде
    console.log(outString);
    let outArray = outString.split(''); // роблю масив з строки 

    if (outArray.length > 3) { // якщо дожина масива більша 3 
      for (let i = outArray.length - 3; i > 0; i -= 3) { // пропускаю масив з кінця вілраховую по три клкменти, після кожного третього ставлю кому 
        outArray.splice(i, 0, ','); // додаю кому за допомогою методу масивів
      }
    }

    if (decimal) { // перевіряю чи число має десятичну частину наприклад 102.32
      outArray.push('.'); // додаю крапку якщо є частина десятична 
      outArray.push(decimal); // додаю цю частину до масива з числом
    }
    return outArray.join(''); // переробляю строку в масив
  }

  function Validate(value) { // функція запобігає повторюванюю підряд однакових операторів
    let last_input = result.slice(-1); // беру станій елемент строки 
    let operators = ['+', '-', '*', '/']; // наші оператори 

    if (value === '.' && last_input === '.') { // якщо елемент це . і останій елемент . 
      return false; // вихід з цикла
    }
    if (operators.includes(value)) { //  якщо в масиві вже є оператор
      if (operators.includes(last_input)) { // якщо останій елемент це наш оператор
        return false; // вихід з цикла
      } else {
        return true; // якщо немає оператора, то ставлю 
      }
    }
    return true; // ставлю крапку
  }

  function percent(value) { // функція відсотрка 
    let percentVal = value.split('');
    for (let i = 0; i < percentVal.length; i++) {
      if (percentVal[i] === '%') { // якщо в масиві буде оператор %
        percentVal[i] = '/100'; // то він буде дорівнювати діленю на 100
      }
    }
    return percentVal.join('');
  }
});