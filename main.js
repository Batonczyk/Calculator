document.addEventListener('DOMContentLoaded', function () {
  const keys = document.querySelectorAll('.key'); 
  const keysValue = document.querySelectorAll('.key span');
  const displayOne = document.querySelector('.display__content-one'); 
  const displayTwo = document.querySelector('.display__content-two'); 

  let result = ''; 

  for (let key of keys) { 
    let btn = key.dataset.key; 
    key.addEventListener('click', function () { 
      if (btn === 'clear') { 
        result = ''; 
        displayOne.innerHTML = ''; 
        displayTwo.innerHTML = ''; 
      } else if (btn === 'Backspace') { 
        result = result.slice(0, -1); 
        displayOne.innerHTML = CleanValue(result); 
      } else if (btn === '=') { 
        let val = eval(percent(result)); 
        displayTwo.innerHTML = CleanOutValue(val); 
      } else if (btn === 'breckets') { 
        if (result.indexOf('(') === -1 || 
          result.indexOf('(') !== -1 && 
          result.indexOf(')') !== -1 && 
          result.lastIndexOf('(') < result.lastIndexOf(')')) {  
          result += '('; 
        } else if (result.indexOf('(') !== -1 && 
          result.indexOf(')') === -1 ||
          result.indexOf('(') !== -1 && 
          result.indexOf(')') !== -1 && 
          result.lastIndexOf('(') > result.lastIndexOf(')')) { 
          result += ')'; 
        }
        displayOne.innerHTML = CleanValue(result); 
      } else {
        if (Validate(btn)) { 
          result += btn;
          displayOne.innerHTML = CleanValue(result); 
        }
      }

    });
  }
  document.addEventListener('keydown', pressKey); 

  function pressKey(e) {
    const press = e.key;
    for (let button of keys) {
      const btn = button.dataset.key;
      if (press === btn) {
        button.click();
        return
      } else if (press === 'Enter') {
        let val = eval(percent(result));
        displayTwo.innerHTML = CleanOutValue(val);
      } else if (press === 'Delete') {
        result = '';
        displayOne.innerHTML = '';
        displayTwo.innerHTML = '';
      }
    }
  }

  function CleanValue(input) { 
    let inputArray = input.split(''); 

    for (let i = 0; i < inputArray.length; i++) { 
      if (inputArray[i] === '*') { 
        inputArray[i] = ` <span class="operator">x</span> `; 
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
    return inputArray.join(''); 
  }

  function CleanOutValue(out) { 
    let outString = out.toString(); 
    let decimal = outString.split('.')[1]; 
    console.log(decimal);
    outString = outString.split('.')[0]; 
    console.log(outString);
    let outArray = outString.split(''); 

    if (outArray.length > 3) { 
      for (let i = outArray.length - 3; i > 0; i -= 3) { 
        outArray.splice(i, 0, ','); 
      }
    }

    if (decimal) { 
      outArray.push('.');
      outArray.push(decimal); 
    }
    return outArray.join(''); 
  }

  function Validate(value) { 
    let last_input = result.slice(-1); 
    let operators = ['+', '-', '*', '/']; 

    if (value === '.' && last_input === '.') { 
      return false; 
    }
    if (operators.includes(value)) { 
      if (operators.includes(last_input)) { 
        return false; 
      } else {
        return true; 
      }
    }
    return true; 
  }

  function percent(value) { 
    let percentVal = value.split('');
    for (let i = 0; i < percentVal.length; i++) {
      if (percentVal[i] === '%') { 
        percentVal[i] = '/100'; 
      }
    }
    return percentVal.join('');
  }
});