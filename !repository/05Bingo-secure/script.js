const addCardBtn = document.getElementById('addCardBtn')
// const removeCardBtn = document.getElementById('removeCardBtn')
const allCardsSection = document.getElementById('allCards')
const cardModel = document.getElementById('cardModel')

// const allCardsElements = [];

class Card {
  constructor(id, name, arrOfNumbers, allOk = true) {
    this.id = id;
    this.name = name.toUpperCase();
    this.numbers = arrOfNumbers;
    this.allOk = allOk;
    
    this.initialSettings(this);
  }

  getElement() {return document.getElementById(this.id);}
  getItems() {return this.getElement().querySelectorAll('[class^="item"]:not(.free)')}
  getOwnObj() {return ALLCARDSOBJS.find((element) => {return element.id == this.id;})}

  initialSettings(obj) {
    const element = this.cardCreateElement()

    element.querySelector('button.openEdit').addEventListener('click', () => {
      obj.openCardEdit()
    })
    
    element.querySelector('button.openRemove').addEventListener('click', () => {
      myConfirm.open(
        'Are you sure to delete?',
        '[ <span style="opacity:0.5;">' + obj.id + '</span> ] ' + obj.name,
        myConfirm.btnCancel,
        function () { obj.remove() }
      )
    })

    ALLCARDSOBJS.push(obj);
    this.markSorteds();
    if (this.allOk) saveCardsInLocalStorage();
    // saveCardsInLocalStorage();
  }

  cardCreateElement() {
    const element = cardModel.cloneNode(true)
    
    element.setAttribute('id', this.id)
    allCardsSection.insertBefore(element, allCardsSection.firstChild)
    this.update(this.name, this.numbers)
    return element;
  }

  update(name, arrOfNumbers, changeId = false) {
    const cardName = this.getElement().querySelector('.cardName')
    const cardId = this.getElement().querySelector('.cardId')
    const items = this.getItems()

    if (changeId) {
      const newId = new Date().getTime().toString(32);
      this.getElement().setAttribute('id', newId);
      this.id = newId;
    }

    this.name = name.trim().toUpperCase();
    this.numbers = arrOfNumbers;
    cardName.innerHTML = this.name
    cardId.innerHTML = this.id

    for (let i = 0; i < 24; i++) {
      if (!(this.numbers[i])) break;
      items[i].innerHTML = this.numbers[i]
    }
    this.markSorteds()
    saveCardsInLocalStorage()
  }

  markSorteds(sorteds) {
    const items = this.getItems()
    let count = 0;

    items.forEach(element => {
      element.removeAttribute('sorted')
    });

    for (let i = SORTEDBALLS.length - 1; i >= 0; i--) {
      const index = this.numbers.indexOf(SORTEDBALLS[i])
      if (index > -1) {
        count++;
        items[index].setAttribute('sorted', count)
      } 
    }
  }

  clearSortedAttribute(number) {
    const index = this.numbers.indexOf(number)
    if (index < 0) return;

    this.getItems()[index].removeAttribute('sorted')
  }

  openCardEdit() {
    cardInput.open(this)
  }

  remove(notify = true) {
    const element = this.getElement();
    
    element.classList.add('cardRemoved');

    setTimeout(() => {
      element.remove()
    }, 300);

    removeFromALLCARDSOBJS(this.id);
    if (notify) {
      new Notification(
        "Bingo card successfully deleted!<br>" +
       '[ <span class="spanNoti">' + this.id + '</span> ] ' + this.name,
        10000,
        {html: "UNDO", function: () => {
            new Card(this.id, this.name, this.numbers);
            new Notification(
              "The card was recovered<br>" +
              '[ <span class="spanNoti">' + this.id + '</span> ] ' + this.name,
              10000,
              undefined
            )
          }
        }
      )
    }
  }
}

const cardInput = {
  modified : false,
  section : document.getElementById('cardInputSection'),
  id : document.getElementById('cardInputId'),
  name : document.getElementById('cardInputName'),
  inputs : document.querySelectorAll('#cardInput input[class^="item"]'),
  btnCancel : document.getElementById('cardInputCancel'),
  btnSave : document.getElementById('cardInputSave'),
  divError : document.getElementById('cardInputErrorHolder'),
  divErrorOutput : document.getElementById('cardInputErrorOutput'),
  numbers : [],
  initialSettings() {
    const disableSave =  () => {cardInput.btnSave.setAttribute('disabled', '');}
    const enableSave = () => {cardInput.btnSave.removeAttribute('disabled');}
    const checkInput = (input) => {
      // if (input.validity.valid) {
        if (cardInput.validity()) {
          enableSave();
          return;
        } 
      // }
      disableSave()
    }
    const fitInputNumber = (input, i) => {
      let value = input.value.slice(0, 2);
      input.value = value;
      cardInput.numbers[i] = value;

      handleEquals(input);
    }
    const handleEquals = (input) => {
      let equals;
      const numbers = cardInput.numbers
      const letter = input.getAttribute('letter')
      const checkFromColumn = (min, max) => {
        for (let i = min; i <= max; i++){
          equals = [];
          for (let j = min; j <= max; j++) {
            if (cardInput.inputs[j].validity.valid) {
              if (numbers[j] == numbers[i]) equals.push(i)
            }

            if (equals.length > 1) {
              equals.forEach(element => cardInput.inputs[element].classList.add('equal'))
            } else {
              cardInput.inputs[i].classList.remove('equal')
            }
          }
        }
      }
      
      switch (letter) {
        case 'b':
          checkFromColumn(0, 4);
          break;
        case 'i':
          checkFromColumn(5, 9);
          break;
        case 'n':
          checkFromColumn(10, 13);
          break;
        case 'g':
          checkFromColumn(14, 18);
          break;
        case 'o':
          checkFromColumn(19, 23);
          break;
        default:
          break;
      }
    }

    cardInput.name.addEventListener('input', function () {
      cardInput.modified = true;
      if (cardInput.name.validity.valid) {
        cardInput.error(false)
      } else {
        // cardInput.error('Fill in the NAME field');
      }
      checkInput(this);
    })
    cardInput.inputs.forEach((element, i) => {
      element.addEventListener('input', function () {
        cardInput.modified = true;
        fitInputNumber(element, i);
        checkInput(element);
      });
    })
  },
  open(obj) {
    cardInput.inputs.forEach(element => { element.classList.remove('equal'); })
    cardInput.numbers = obj.numbers.concat();
    cardInput.modified = false;

    if (obj.allOk) {
      cardInput.btnCancel.onclick = function () {
        if (!(cardInput.modified)) {
          cardInput.close();
          return;
        }
        myConfirm.open(
          'You sure to cancel?',
          'All the progress will be lost.',
          myConfirm.btnCancel,
          function () {
            cardInput.close();
          }
        )
      }
    } else {
      cardInput.btnCancel.onclick = function () {
        if (!(cardInput.modified))  {
          obj.remove(false);
          cardInput.close();
          return;
        }
        myConfirm.open(
          'You sure to cancel?',
          'All the progress will be lost.',
          myConfirm.btnCancel,
          function () {
            obj.remove(false);
            cardInput.close();
          }
        )
      }
    }
    cardInput.btnSave.onclick = function () {
      cardInput.save(obj);
    };

    cardInput.id.innerHTML = obj.id;
    cardInput.name.value = obj.name
    cardInput.inputs.forEach((element, i) => {
      // if (!(obj.numbers[i])) return;
      element.value = obj.numbers[i]
    })

    if (cardInput.validity()) {
      cardInput.btnSave.removeAttribute('disabled');
    } else {
      cardInput.btnSave.setAttribute('disabled', '');
    }

    cardInput.section.classList.add('open');
  },
  close() {
    cardInput.section.classList.remove('open'); 
  },
  save(obj) {
    const newName = cardInput.name.value;
    const newNumbers = [];

    cardInput.inputs.forEach((element) => {newNumbers.push(Number(element.value))})
    
    if (obj.allOk)
      obj.update(newName, newNumbers, true)
    else
      obj.update(newName, newNumbers, false)

    obj.allOk = true;
    cardInput.close();
  },
  validity() {

    if (cardInput.name.validity.valid == false) {
      cardInput.error('Fill in the NAME field')
      return false;
    }

    for (let i=0, l=cardInput.inputs.length; i<l; i++) {
      const input = cardInput.inputs[i];
      let letter = ' <span class="notranslate" translate="no">' + input.getAttribute('letter').toUpperCase() + "</span> ";

      if (input.classList.contains('equal')) { 
        cardInput.error('The number ' + input.value + ' is repeated in column ' + letter, 'att');
        return false
      }

      if (input.validity.valid) {
        continue
      }

      if (input.validity.valueMissing) {
        cardInput.error('Column ' + letter + ' has an element missing')
      } else if (input.validity.rangeUnderflow) {
        cardInput.error('The value ' + input.value + ' is too low for column ' + letter)
      } else if (input.validity.rangeOverflow) {
        cardInput.error('The value ' + input.value + ' is too high for column ' + letter)
      }
      return false
    }

    cardInput.error(false)
    return true;
  },
  error(msg, type) {
    if (msg) {
      cardInput.divErrorOutput.innerHTML = msg;
      cardInput.divError.classList.add('visible')
      if (type) {
        cardInput.divError.classList.add('att')
      } else {
        cardInput.divError.classList.remove('att')
      }
    } else {
      cardInput.divError.classList.remove('visible')
    }
    
  }
}
cardInput.initialSettings();


let ALLCARDSJONSON = '[{"id":"181a8a33a05","name":"ALFREDO","numbers":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]},{"id":"181a8a3781f","name":"MARIA","numbers":[1,1,1,1,1,22,22,22,22,22,33,33,33,33,55,55,55,55,55,66,66,66,66,66]}]'
const ALLCARDSOBJS = []

onload = function() {
  let foundCards = undefined;
  let foundBalls = undefined;

  if (typeof(Storage) == "undefined"){
    alert("Desculpe, seu navegador não tem suporte :(\nEntão seus dados serão apagados ao recarregar a página");
  } 

  if (localStorage.cards) {foundCards = JSON.parse(localStorage.cards);}
  if (localStorage.sortedBalls) {foundBalls = JSON.parse(localStorage.sortedBalls);}

  if (foundCards) {
    foundCards.forEach((element, i) => {
      new Card(element.id, element.name, element.numbers)
    })
  }

  if (foundBalls) {
    const arr = foundBalls.concat()
    foundBalls = []
    foundBalls = arr.map((element) => {
      pushBall(element);
      return element
    })
  }
}

// const MYLOCALSTORAGE =  {

//   content: { // from the localStorage
//     ALLCARDSOBJS,
//     SORTEDBALLS,
//     // ALLAPPEARENCEVALUES
//   },
//   saveInLocalStorage(property2Save) {

//   }
// }

function saveInLocalStorageEverything(property2Save) {

}


addCardBtn.addEventListener('click', addCard)
function addCard() {
  const cancelBtn = document.getElementById('cardInputCancel')
  const saveBtn = document.getElementById('cardInputSave')
  const newId = new Date().getTime().toString(32)
  const newArr = [];
  const newCard = new Card(newId, '', [], false)
  newCard.openCardEdit()
}

function saveCardsInLocalStorage() {
  if (typeof(Storage) == "undefined") { return; }

  if (ALLCARDSOBJS) {
    localStorage.cards = JSON.stringify(ALLCARDSOBJS)
  } else {
    localStorage.cards = '';
  }
}

function removeFromALLCARDSOBJS(id) {
  const index = ALLCARDSOBJS.findIndex((element) => {
    return element.id == id
  })

  ALLCARDSOBJS.splice(index, 1)
  saveCardsInLocalStorage()
}

function resetjson() { //for tests only
  localStorage.cards = '[{"id":"181a8a3781f","name":"MARIA","numbers":[14,10,7,11,15,20,27,23,28,25,32,42,34,33,52,55,58,56,53,71,64,69,72,66],"allOk":true},{"id":"1gek9c3j5","name":"CARLOS","numbers":[3,5,1,12,11,23,22,19,30,29,33,45,44,36,55,46,59,60,58,66,75,65,61,62],"allOk":true}]'
}
function createSomeCards() {
  const cards = [
    new Card(new Date().getTime().toString(32), 'xxxxxx', [1,1,1,1,1,22,22,22,22,22,33,33,33,33,55,55,55,55,55,66,66,66,66,66]),
    new Card(new Date().getTime().toString(32), 'yyyyyy', [1,1,1,1,1,22,22,22,22,22,33,33,33,33,55,55,55,55,55,66,66,66,66,66]),
    new Card(new Date().getTime().toString(32), 'zzzzzz', [1,2,3,4,5,22,22,22,22,22,33,33,33,33,55,55,55,55,55,66,66,66,66,66])
  ]

  let length = cards.length;
  for (let i = 0; i < length; i++){
    ALLCARDSOBJS.push(cards[i])
  }
}


// balls *******************************************
const allBalls = document.getElementById('allBalls')
const balls = document.querySelectorAll('.ball')
const allBallsHistoric = document.getElementById('allBallsHistoricContent')
const ballHistoricModel = document.getElementById('ballHistoricModel')
const optionsBallsSection = document.getElementById('optionsBalls')
const inputBall = document.getElementById('inputBall')
const inputPlus = document.getElementById('inputPlus')
const inputMinus = document.getElementById('inputMinus')
const tagLetterInput = optionsBallsSection.querySelector('.tagLetter')
const tagOrderInput = optionsBallsSection.querySelector('.tagOrder')
const pushBallBtn = document.getElementById('pushBallBtn')
const undoBallBtn = document.getElementById('undoBall')
let toUndo = undefined;

let SORTEDBALLS = []

function saveBallsInLocalStorage() {
  if (typeof(Storage) == "undefined") { return; }

  if (SORTEDBALLS) {
    localStorage.sortedBalls = JSON.stringify(SORTEDBALLS)
  } else {
    localStorage.sortedBalls = '';
  }
}

function resetBallsJson() {// for tests only
  localStorage.sortedBalls = '[1,44,33,22,16,34,22,3,6,14,71,32,23]'
}

pushBallBtn.addEventListener('click', function() {pushBall()})
inputBall.addEventListener('input', controlThingsOfInputBall);
undoBallBtn.addEventListener('click', undoBall)

function pushBall(number = inputBall.value) {
  const newBallHistoric = ballHistoricModel.cloneNode(true)

  SORTEDBALLS.push(Number(number))
  saveBallsInLocalStorage()
  undoBallBtn.classList.remove('blocked')

  newBallHistoric.removeAttribute('id')
  newBallHistoric.querySelector('.tagLetter').innerHTML = getLetter(number)
  newBallHistoric.querySelector('.value').innerHTML = number.toString().padStart(2,'0')
  newBallHistoric.querySelector('.tagOrder').innerHTML = SORTEDBALLS.length + '°'

  allBallsHistoric.insertBefore(newBallHistoric, allBallsHistoric.firstChild)

  inputBall.value = '';
  tagLetterInput.innerHTML = ''
  tagOrderInput.innerHTML = SORTEDBALLS.length + 1 + '°';
  controlThingsOfInputBall()

  ALLCARDSOBJS.forEach((element) => {
    element.markSorteds(SORTEDBALLS)
  })

  markSortedBalls()
}

function undoBall() {
  const toRemove = allBallsHistoric.firstChild;
  let number = 0;

  undoBallBtn.classList.add('blocked')
  toRemove.classList.add('removed');
  
  if (toUndo) { clearTimeout(toUndo) }
  toUndo = setTimeout(() => {
    toRemove.remove()

    number = SORTEDBALLS.pop()
    saveBallsInLocalStorage();
    markSortedBalls()
    tagOrderInput.innerHTML = SORTEDBALLS.length + 1 + 'º';
    if (SORTEDBALLS.length) {undoBallBtn.classList.remove('blocked')}
    else {undoBallBtn.classList.add('blocked')}

    ALLCARDSOBJS.forEach(element => {
      element.clearSortedAttribute(number)
      element.markSorteds()
    })

    controlThingsOfInputBall()
  }, 300);
}

function markSortedBalls() {
  balls.forEach(element => {
    if (SORTEDBALLS.includes(Number(element.innerHTML))) {
      element.classList.add('sorted')
    } else {
      element.classList.remove('sorted')
    }
  })
}

function controlThingsOfInputBall() {
  const number = Number(inputBall.value)
  const letter = getLetter(number)
  const order = SORTEDBALLS.length + 1 + '°'

  inputPlus.setAttribute('disabled', 'disabled')
  inputMinus.setAttribute('disabled', 'disabled')

  tagLetterInput.innerHTML = letter;
  tagOrderInput.innerHTML = order;

  if (SORTEDBALLS.includes(number) || number <= 0 || number > 75) {
    pushBallBtn.setAttribute('disabled', 'disabled')
  } else {
    pushBallBtn.removeAttribute('disabled')
  }

  if (number > 1) {
    inputMinus.removeAttribute('disabled')
  } 

  if (number < 75) {
    inputPlus.removeAttribute('disabled')
  }
}

function getLetter(number = 0) {
  if (number < 1 || number > 75) return ''
  else if (number <= 15) return 'B'
  else if (number <= 30) return 'I'
  else if (number <= 45) return 'N'
  else if (number <= 60) return 'G'
  else return 'O'
}

function increaseInput() {
  const number = Number(inputBall.value);
  if (number < 1) {
    inputBall.value = 1;
  } else {
    inputBall.value = number + 1;
  }
  controlThingsOfInputBall()
}
function decreaseInput() {
  const number = Number(inputBall.value);
  if (number > 75) {
    inputBall.value = 75;
  } else {
    inputBall.value = number - 1;
  }
  controlThingsOfInputBall()
}

/* increase */
let intervalPlus;
inputPlus.addEventListener('mousedown', () => {
  increaseInput()
  intervalPlus = setTimeout(() => {
    intervalPlus = setInterval(() => {
      increaseInput();
      if(inputBall.value > 74) {
        clearInterval(intervalPlus)
        inputBall.value = 75;
        controlThingsOfInputBall()
      }
    }, 50)
  }, 300)
})
inputPlus.addEventListener('mouseup', () => {
  if (intervalPlus) clearInterval(intervalPlus);
})
inputPlus.addEventListener('mouseout', () => {
  if (intervalPlus) clearInterval(intervalPlus);
})

/* decrease */
let intervalMinus;
inputMinus.addEventListener('mousedown', () => {
  decreaseInput()
  intervalMinus = setTimeout(() => {
    intervalMinus = setInterval(() => {
      decreaseInput();
      if(inputBall.value < 2) {
        clearInterval(intervalMinus)
        inputBall.value = 1;
        controlThingsOfInputBall()
      }
    }, 50)
  }, 300)
})
inputMinus.addEventListener('mouseup', () => {
  if (intervalMinus) clearInterval(intervalMinus)
})
inputMinus.addEventListener('mouseout', () => {
  if (intervalMinus) clearInterval(intervalMinus)
})



/* more options */

const moreOptionsSection = {
  element : document.getElementById('moreOptions'),
  expandMoreBtn : document.getElementById('expandMoreBtn'),
  expandLessBtn : document.getElementById('expandLessBtn'),
  buttons : document.querySelectorAll('#moreOptions button:not(:first-child)'),
  pageSettingsBtn : document.getElementById('pageSettingsBtn'),
  initialSettings() {
    this.expandMoreBtn.addEventListener('click', () => {moreOptionsSection.openf()});
    this.expandLessBtn.addEventListener('click', () => {moreOptionsSection.closef()});
    this.buttons.forEach(element => {
      element.addEventListener('click', () => {moreOptionsSection.closef()})
    })
    this.pageSettingsBtn.addEventListener('click', () => {pageSettingsSection.openf()});
  },
  openf() {
    this.element.classList.add('open')

    this.buttons.forEach(element => {
      element.classList.add('visible')
    })

    this.expandMoreBtn.classList.remove('visible')
    this.expandLessBtn.classList.add('visible')
    
    setTimeout(() => {
      document.body.addEventListener('click', myAddEvent)
    }, 100)

    function myAddEvent() {
      moreOptionsSection.closef()
      document.body.removeEventListener('click', myAddEvent)
    }

  },
  closef() {
    this.element.classList.remove('open')

    this.buttons.forEach(element => {
      element.classList.remove('visible')
    })

    this.expandLessBtn.classList.remove('visible')
    this.expandMoreBtn.classList.add('visible')
  }
}
moreOptionsSection.initialSettings();

 
const pageSettingsSection = {
  element : document.getElementById('pageSettingsSection'),
  closeBtn: document.getElementById('pageSettingsCloseBtn'),
  settings : [],
  initialSettings() {
    this.closeBtn.addEventListener('click', this.closef)
  },
  openf() {
    pageSettingsSection.element.classList.add('open');
    // sttImport.findPreview();
  },
  closef() {
    pageSettingsSection.element.classList.remove('open');
  },
  exportData() {},
  importData() {}
}
pageSettingsSection.initialSettings()

// !
pageSettingsSection.openf()
console.warn('open settrings turned on')


/* apearence */
const ALLAPPEARENCEVALUES = {
  primaryColor : 'rgb(154, 205, 50)',
  theme: '#',
  sortedColors: ['#ff5c53', '#ffff81', '#90ee90']
}
const appearence = {
  primaryColor : {
    element : document.getElementById("sttPrimaryColor"),
    btnApply : document.querySelector('#sttPrimaryColor button'),
    optionsElements : document.querySelectorAll('#sttPrimaryColor .optionsHide .option'),
    optionSelectElement : document.querySelector("#sttPrimaryColor .options .select"),
    optionValues: [
      'rgb(154, 205, 50)',
      'rgb(218, 113, 170)',
      'rgb(53, 152, 219)',
      'rgb(210, 83, 2)',
      'rgb(22, 160, 134)',
      'rgb(153, 123, 213)',
      'rgb(139, 192, 100)',
      'rgb(45, 204, 112)',
      'rgb(230, 199, 82)'
    ],
    selected : 'rgb(154, 205, 50)',
    initialSettings() {
      const options = this.optionsElements;
      const values = this.optionValues;

      this.setValue()
      for (let i=0, l=options.length; i<l; i++) {
        options[i].style.setProperty('--color', values[i])
        options[i].addEventListener('click', function() {
          appearence.primaryColor.optionSelectElement.style.setProperty('--color', values[i])
          // appearence.primaryColor.btnApply.value = values[i]
          appearence.primaryColor.selected = values[i]
        })
      }
      this.btnApply.addEventListener('click', function() {
        appearence.primaryColor.setValue()
        appearence.saveInLocalStorage("primaryColor")
      })
    },
    setValue() {
      const value = appearence.primaryColor.selected
      document.body.style.setProperty('--primaryColor', value)
      appearence.primaryColor.optionSelectElement.style.setProperty('--color', value)
    }
  },
  theme : {
    element : document.getElementById("sttTheme"),
    btnApply : document.querySelector("#sttTheme header button"),
    linkStyle : document.getElementById("styleTheme"),
    optionsElements : document.querySelectorAll("#sttTheme .content .option"),
    optionSelectElement : document.querySelector("#sttTheme header .option"),
    optionValues : [
      "#",
      'style_theme_dark.css'
    ],
    selected : "#",
    initialSettings() {
      const setIcon = function(i) {
        const icon = appearence.theme.optionsElements[i].querySelector('span.material-icons');
          const clone = icon.cloneNode(true);
          appearence.theme.optionSelectElement.innerHTML = "";
          appearence.theme.optionSelectElement.appendChild(clone);
      }
      const options = this.optionsElements;
      const values = this.optionValues

      this.setValue()
      setIcon(values.findIndex(y => y == appearence.theme.selected))
      const l = options.length;
      for (let i=0; i<l; i++){
        // set image when it is available
        options[i].addEventListener('click', function() {
          setIcon(i);
          appearence.theme.selected = values[i]
        })
      }
      this.btnApply.addEventListener('click', function() {
        setIcon(values.findIndex(y => y == appearence.theme.selected))
        appearence.theme.setValue()
        appearence.saveInLocalStorage("theme")
      })
    },
    setValue() {
      const value = appearence.theme.selected
      appearence.theme.linkStyle.setAttribute('href', value)
    }
  },
  sortedColors : {
    element : document.getElementById("sttSortedColors"),
    btnApply : document.querySelector('#sttSortedColors button'),
    optionsElements : document.querySelectorAll("#sttSortedColors .option input"),
    selected : ['#ff5c53', '#ffff81', '#90ee90'],
    initialSettings() {
      const options = this.optionsElements;
      const values = this.selected;

      let l = values.length;
      for (let i=0; i<l; i++) {
        options[i].value = values[i]
      }

      this.btnApply.addEventListener('click', function() {
        const newValues = [];
        for (let i = 0; i < 3; i++) {
          newValues[i] = options[i].value
        }
        appearence.sortedColors.selected = newValues
        appearence.sortedColors.setValue();
        appearence.saveInLocalStorage("sortedColors")
        console.log(newValues)
      })

    },
    setValue() {
      const values = appearence.sortedColors.selected
      for (let i = 0; i < 3; i++) {
        document.body.style.setProperty('--card-sortedItem-bk-' + i, values[i])
      }
    }
  },
  initialSettings() {
    appearence.primaryColor.initialSettings();
    appearence.theme.initialSettings();
    appearence.sortedColors.initialSettings();
  },
  saveInLocalStorage(property2Save) {
    ALLAPPEARENCEVALUES[property2Save] = appearence[property2Save].selected;

    console.table(ALLAPPEARENCEVALUES)
  }
}
appearence.initialSettings()


/* export*/
const sttExport = {
  element : document.getElementById('sttExport'),
  button : document.getElementById('sttExportBtn'),
  toCopy : document.getElementById('sttExport2copy'),
  checkboxes : [
    document.getElementById('sttExport1opt'),
    document.getElementById('sttExport2opt')
  ],
  initialSettings() {
    this.checkboxes.forEach(element => {
      element.addEventListener('click', () => {
        if (element.getAttribute('ischecked') == 'true') {
          element.setAttribute('ischecked', 'false')
        } else {
          element.setAttribute('ischecked', 'true')
        }

        const some = this.checkboxes.some(element => {
          return (element.getAttribute('ischecked') == "true")
        })
        if (some) {
          this.button.removeAttribute('disabled')
        } else {
          this.button.setAttribute('disabled','')
        }
      })
    })

    this.toCopy.addEventListener('copy', () => {
      new Notification("Copiado para a área de transfência", 5000)
    })

    this.button.addEventListener('click', this.export)
  },
  export() {
    const exportContet = {
      balls : [],
      cards : []
    }
    if (sttExport.checkboxes[0].getAttribute('ischecked') == 'true') { exportContet.balls = SORTEDBALLS; }
    if (sttExport.checkboxes[1].getAttribute('ischecked') == 'true') { exportContet.cards = ALLCARDSOBJS}

    sttExport.toCopy.innerHTML = JSON.stringify(exportContet);
    sttExport.toCopy.select();
    document.execCommand("copy");
  }
}
sttExport.initialSettings()


/*import*/
const sttImport = {
  element : document.getElementById('sttImport'),
  input : document.getElementById('sttImportInput'),
  clearBtn : document.getElementById('clearImportInputBtn'),
  inputState : document.getElementById('sttImportInvalid'),
  inputStateMessage : document.getElementById('sttImportInvalidMessage'),
  previewBtn : document.getElementById('sttImportPreview'),
  foundPreview : {},
  foundNonExistent : {},
  addBallsBtn : document.getElementById('addBallsBtn'),
  addCardsBtn : document.getElementById('addCardsBtn'),
  ballsPreviewSection : document.getElementById('sttImportBalls'),
  ballsPreview : document.getElementById('ballsPreview'),
  ballPreviewModel : document.getElementById('ballPreviewModel'),
  cardsPreviewSection : document.getElementById('sttImportCards'),
  cardsPreview : document.getElementById('cardsPreview'),
  cardPreviewModel : document.getElementById('cardPreviewModel'),
  cardPreviewItems : document.querySelectorAll('#cardPreviewModel .item:not(.free)'),
  cardPreviewId : document.querySelector('#cardPreviewModel .id'),
  cardPreviewName : document.querySelector('#cardPreviewModel .name'),
  initialSettings() {
    // this.previewBtn.addEventListener('click', this.findPreview)
    this.input.addEventListener('input', sttImport.findPreview)
    this.clearBtn.addEventListener('click', () => {
      sttImport.input.value = "";
      sttImport.findPreview()
    })

    sttImport.addBallsBtn.addEventListener('click', function() {
      myConfirm.open(
        'Add all undrawn balls found?',
        'All undrawn balls found in the import will be defined as already drawn.',
        myConfirm.btnOk,
        sttImport.addBalls
      )
    })
    document.getElementById('replaceBallsBtn').addEventListener('click', function() {
      myConfirm.open(
        'Are you sure to replace all the balls?',
        'All balls drawn will be replaced by the balls found in the import.' +
        '<br><br>* This action cannot be undone!',
        myConfirm.btnCancel,
        sttImport.replaceBalls
      )
    })
    sttImport.addCardsBtn.addEventListener('click', function() {
      myConfirm.open(
        'Add all found bingo cards?',
        'All non-existing bingo cards found in the import will be added.',
        myConfirm.btnOk,
        sttImport.addCards
      )
    })
    document.getElementById('replaceCardsBtn').addEventListener('click', function() {
      myConfirm.open(
        'Are you sure to replace all bingo cards?',
        'All bingo cards will be replaced with the cards found in the import' +
        '<br><br>* This action cannot be undone!',
        myConfirm.btnCancel,
        sttImport.replaceCards
      )
    })
  },
  checkArr(arr) {
    let valid = false;
    valid = arr.every(element => {
      return (element > 0 && element < 76)
    });
    return valid;
  },
  findPreview() {
    let text = sttImport.input.value;
    if (!(text.trim())) {
      sttImport.input.classList.remove('invalid')
      sttImport.inputState.classList.remove('visible')
      sttImport.clearBtn.classList.remove('visible')
      sttImport.ballsPreviewSection.classList.remove('visible')
      sttImport.cardsPreviewSection.classList.remove('visible')
      return
    } else {
      sttImport.clearBtn.classList.add('visible')
    }

    try {
      sttImport.foundPreview = JSON.parse(text);
      if (!(sttImport.foundPreview.balls) || !(sttImport.foundPreview.cards)) {
        throw "A Property of JSON string is missing";
      }
      if (!(sttImport.checkArr(sttImport.foundPreview.balls))) {
        throw "Some sorted ball has invalid format or is out of range"
      }
      sttImport.foundPreview.cards.forEach(element => {
        if (!(element.id) || !(element.name) || !(element.numbers)) { 
          throw "Some Card ["+ element.id + "] property is missing"
        }
        if (element.numbers.length != 24) {
          throw "Card [" + element.id + "} does not have 24 numbers"
        }
        if(!(sttImport.checkArr(element.numbers))) {
          throw "Card ["+ element.id +"] has a number out of range"
        }
        const checkRange = (number, i) => {
          const min = [1,1,1,1,1,16,16,16,16,16,31,31,31,31,46,46,46,46,46,61,61,61,61,61]
          const max = [15,15,15,15,15,30,30,30,30,30,45,45,45,45,60,60,60,60,60,75,75,75,75,75]
          if (number >= min[i] && number <= max[i]) return true;
          return false
        } 
        element.numbers.forEach((element2, index) => {
          const count = element.numbers.filter(element3 => {
            return (element3 ==element2);
          })
          if (count.length > 1) {
            throw "The number " + element2 + " appears twice or more in Card [" + element.id + "]"
          }
          if (!(checkRange(element2, index))) {
            throw "Number " + element2 + " of  Card [" + element.id + "] is in an invalid position"
          }
        })
      })
    } catch (error) {
      sttImport.input.classList.add('invalid')
      sttImport.inputState.classList.add('visible')
      sttImport.ballsPreviewSection.classList.remove('visible')
      sttImport.cardsPreviewSection.classList.remove('visible')

      sttImport.inputStateMessage.innerHTML = error.toString()
      // console.error(error.toString())
      return;
    }

    sttImport.foundNonExistent = {balls:0, cards:0}
    sttImport.input.classList.remove('invalid')
    sttImport.inputState.classList.remove('visible')
    sttImport.ballsPreview.innerHTML = '';
    if (sttImport.foundPreview.balls.length > 0) {
      sttImport.foundPreview.balls.forEach(element => {sttImport.pushFoundBall(element)})
      sttImport.ballsPreviewSection.classList.add('visible')
    }

    sttImport.cardsPreview.innerHTML = '';
    if (sttImport.foundPreview.cards.length > 0) {
      sttImport.foundPreview.cards.forEach(element => {sttImport.pushFoundCard(element)})
      sttImport.cardsPreviewSection.classList.add('visible')
    }

    if (sttImport.foundNonExistent.balls > 0) {
      sttImport.addBallsBtn.removeAttribute('disabled')
    } else {
      sttImport.addBallsBtn.setAttribute('disabled', 'disable')
    }

    if (sttImport.foundNonExistent.cards > 0) {
      sttImport.addCardsBtn.removeAttribute('disabled')
    } else {
      sttImport.addCardsBtn.setAttribute('disabled', 'disable')
    }

  },
  pushFoundBall(ballNumber) {
    const newBall = sttImport.ballPreviewModel.cloneNode(true);
    newBall.removeAttribute('id');
    newBall.innerHTML = ballNumber;
    if (!(SORTEDBALLS.includes(ballNumber))) {
      newBall.classList.add('highlighted')
      sttImport.foundNonExistent.balls += 1;
    };
    sttImport.ballsPreview.insertBefore(newBall, sttImport.ballsPreview.firstChild)
  },
  pushFoundCard(card) {
    sttImport.cardPreviewId.innerHTML = card.id;
    sttImport.cardPreviewName.innerHTML = card.name;
    card.numbers.forEach((element, index) => {
      sttImport.cardPreviewItems[index].innerHTML = element
    })

    const newCard = sttImport.cardPreviewModel.cloneNode(true);
    newCard.removeAttribute('id');
    let includes = ALLCARDSOBJS.some(element => {
      return (element.id == card.id)
    })
    if (!(includes)) {
      newCard.classList.add('highlighted')
      sttImport.foundNonExistent.cards += 1;
    }
    sttImport.cardsPreview.insertBefore(newCard, sttImport.cardsPreview.firstChild)
  },
  addBalls(notify = true) {
    let toAdd = sttImport.foundPreview.balls.filter(element => {
      return (!(SORTEDBALLS.includes(element)));
    })
    toAdd = new Set(toAdd)
    toAdd.forEach(element => {
      pushBall(element);
    })
    // console.log('Bolas adicionadas com sucesso', toAdd)
    if(notify) {
      const arr = []
      for (let x of toAdd) arr.push(x);
      new Notification('Bolas adicionadas com sucesso!<br>(<span style="opacity:0.7">' +
      toAdd.size +'</span>) = [<span class="spanNoti">' + arr.join(', ') +
      '</span>]', 5000 + (arr.length * 500))
    }
    sttImport.findPreview()
  },
  replaceBalls() {
    SORTEDBALLS = []
    saveBallsInLocalStorage()
    
    const toRemove = document.querySelectorAll('#allBallsHistoric .ballHistoric');
    toRemove.forEach(element => element.remove())

    sttImport.addBalls(false)
    // console.log('Bolas substituídas com sucesso')
    new Notification("Bolas substituídas com sucesso!", 5000)
    sttImport.findPreview()
  },
  addCards(notify = true) {
    let toAdd = sttImport.foundPreview.cards.filter(element => {
      for (let i = ALLCARDSOBJS.length - 1; i >= 0; i--) {
        if (element.id == ALLCARDSOBJS[i].id) return false
      }
      return true
    })

    let text = ''
    toAdd.forEach(element => {
      new Card(element.id, element.name, element.numbers);
      text += `<br>[<span class="spanNoti">${element.id}</span>] ${element.name}`;
    })
    saveCardsInLocalStorage()


    // ! notification time = toAdd.lenght * 5s
    // ! notification = [id] name
    if (notify) { 
      new Notification("Cartelas adicionadas com sucesso!" 
      + text, 5000 + (toAdd.length * 1000))
    }
    // console.log('cards adicionados com sucesso', text)
    sttImport.findPreview()
  },
  replaceCards() {
    for (let i = ALLCARDSOBJS.length - 1; i >= 0; i--) {
      ALLCARDSOBJS[i].remove(false)
    }
    
    sttImport.addCards(false)
    new Notification("Cartelas Subtituídas com sucesso!", 5000)

    sttImport.findPreview()
  }
}
sttImport.initialSettings()


// sttImport.input.value = '{"balls":[5,32,1,44,33,22,16,34,3,6,14,51,47,15,23,36,31,2,4,18,19,67,66,62,43,41],"cards":[{"id":"181a8a3781f","name":"MARIA","numbers":[14,10,7,11,15,20,27,23,28,25,32,42,34,33,52,55,58,56,53,71,64,69,72,66]},{"id":"1g7ob70t9","name":"JOAO SS","numbers":[14,10,7,11,15,20,27,23,28,25,32,42,34,33,52,55,58,56,53,71,64,69,72,66]},{"id":"1g7ob70t8","name":"JOAO SS","numbers":[14,10,7,11,15,20,27,23,28,25,32,42,34,33,52,55,58,56,53,71,64,69,72,68]}]}'

setTimeout(() => {
  sttImport.findPreview()
}, 200)



/* notifications */
class Notification {
  constructor(message, expire = 3000, button = undefined) {
    this.message = message;
    this.expire = expire;
    this.button = button;

    this.initialSettings();
  }
  initialSettings() {
    const element = document.createElement('div')
    const message = document.createElement('p')
    let button = undefined
    if (this.button) {button = document.createElement('button')}

    element.classList.add('notification')
    message.innerHTML = this.message
    
    element.appendChild(message)
    if (button != undefined) {
      button.innerHTML = this.button.html
      button.addEventListener("click", this.button.function)
      element.appendChild(button)

      button.addEventListener('click', function() {
        button.setAttribute("disabled", "disabled")
      })
    }
    
    setTimeout(() => {
      element.classList.add('expired')
      if (button != undefined) button.setAttribute('disabled', 'disabled')
    }, this.expire - 300);
    setTimeout(() => {
      element.remove()
    }, this.expire + 300);
    
    notification.element.appendChild(element)
  }
}
const notification = {
  element : document.getElementById('notificationSection'),
}

// new Notification("hello worl", 5000, {html: "UNDO", function: () => {console.log('HEYY')}})
// new Notification("xxxxxxxxx", 3000, {html: "UNDO", function: () => {console.log('HEYY')}})
// new Notification("xxxxxxxxx", 11000, {html: "UNDO", function: () => {console.log('HEYY')}})
// new Notification("xxxxxxxxx", 10000, {html: "UNDO", function: () => {console.log('HEYY')}})
// new Notification("xxxxxxxxx", 2000, {html: "UNDO", function: () => {console.log('HEYY')}})



/* MY CONFIRM */
const myConfirm = {
  section : document.getElementById('myConfirmSection'),
  heading : document.getElementById('myConfirmH'),
  paragraph : document.getElementById('myConfirmP'),
  btnOk : document.getElementById('myConfirmBtnOk'),
  btnCancel : document.getElementById('myConfirmBtnCancel'),
  initialSettings() {
    // myConfirm.btnOk.addEventListener('click', myConfirm.ok);
    // myConfirm.btnCancel.addEventListener('click', myConfirm.cancel);
  },
  open(heading, p, primaryBtn, funcOk, funcCancel) {
    myConfirm.heading.innerHTML = heading;
    myConfirm.paragraph.innerHTML = p;
    myConfirm.btnCancel.focus();
    myConfirm.section.classList.add('open')
    
    myConfirm.btnOk.classList.remove('primary');
    myConfirm.btnCancel.classList.remove('primary');
    primaryBtn.classList.add('primary')
    if (funcOk) {
      myConfirm.btnOk.onclick = () => { myConfirm.close(funcOk);};
    } else {
      myConfirm.btnOk.onclick = () => { myConfirm.close(undefined);};
    }
    if (funcCancel) {
      myConfirm.btnCancel.onclick = () => { myConfirm.close(funcCancel);}
    } else {
      myConfirm.btnCancel.onclick = () => { myConfirm.close(undefined);};
    }
  },
  close(func) {
    if (func) { func() }

    myConfirm.section.classList.remove('open');
  },
}
myConfirm.initialSettings()

// myConfirm.open('you sure to delete?', 'no way back', myConfirm.btnCancel, myConfirm.cancel)



