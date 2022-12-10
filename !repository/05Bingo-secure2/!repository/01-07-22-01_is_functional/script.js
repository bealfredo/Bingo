const addCardBtn = document.getElementById('addCardBtn')
// const removeCardBtn = document.getElementById('removeCardBtn')
const allCardsSection = document.getElementById('allCards')
const cardModel = document.getElementById('cardModel')
const cardInputSection = document.getElementById('cardInputSection')

const allCardsElements = [];

class Card {
  constructor(id, name, arrOfNumbers) {
    this.id = id;
    this.name = name.toUpperCase();
    this.numbers = arrOfNumbers;
    
    this.inHtml(this);
  }

  getElement() {return document.getElementById(this.id);}
  getItems() {return this.getElement().querySelectorAll('[class^="item"]:not(.free)')}
  getOwnObj() {return ALLCARDSOBJS.find((element) => {return element.id == this.id;})}

  inHtml(obj) {
    const element = this.cardCreateElement()

    element.querySelector('button.openEdit').addEventListener('click', () => {
      obj.openCardEdit()
    })
    
    element.querySelector('button.openRemove').addEventListener('click', () => {
      obj.openRemove()
    })
    element.querySelector('button.confirmRemove').addEventListener('click', () => {
      obj.remove()
    })
    element.querySelector('button.cancelRemove').addEventListener('click', () => {
      obj.closeRemove()
    })
  }

  cardCreateElement() {
    const element = cardModel.cloneNode(true)
    
    element.setAttribute('id', this.id)
    allCardsSection.insertBefore(element, allCardsSection.firstChild)
    this.update(this.name, this.numbers)
    return element;
  }

  update(name, arrOfNumbers) {
    const cardName = this.getElement().querySelector('.cardName')
    const items = this.getItems()

    this.name = name.trim().toUpperCase();
    this.numbers = arrOfNumbers;
    cardName.innerHTML = this.name

    for (let i = 0; i < 24; i++) {
      if (!(this.numbers[i])) break;
      items[i].innerHTML = this.numbers[i]
    }
    saveCardsInLocalStorage()
  }

  markSorteds(sorteds) {
    const items = this.getItems()
    let count = 0;

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
    const id = document.getElementById('cardInputId')
    const name = document.getElementById('cardInputName')
    const inputs = cardInputSection.querySelectorAll('input[class^="item"]');

    id.innerHTML = this.id;
    name.value = this.name
    inputs.forEach((element, i) => {
      element.value = this.numbers[i]
    })

    cardInputSection.classList.add('open');
  }

  openRemove() {
    const cardRemove = this.getElement().querySelector('.cardRemove')

    cardRemove.classList.remove('closed');
  }

  closeRemove() {
    const cardRemove = this.getElement().querySelector('.cardRemove')

    cardRemove.classList.add('closed');
  }

  remove() {
    const element = this.getElement();
    
    element.classList.add('cardRemoved');

    setTimeout(() => {
      element.remove()
    }, 300);

    removeFromALLCARDSOBJS(this.id);
  }
}


let ALLCARDSJONSON = '[{"id":"181a8a33a05","name":"ALFREDO","numbers":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]},{"id":"181a8a3781f","name":"MARIA","numbers":[1,1,1,1,1,22,22,22,22,22,33,33,33,33,55,55,55,55,55,66,66,66,66,66]}]'
let ALLCARDSOBJS = []

onload = function() {
  document.getElementById('cardInputCancel').addEventListener('click', () => {
    cardInputSection.classList.remove('open')
  });

  if (typeof(Storage) == "undefined"){
    alert("Desculpe, seu navegador não tem suporte :(\nEntão seus dados serão apagados ao recarregar a página");
  } 

  if (localStorage.cards) {ALLCARDSOBJS = JSON.parse(localStorage.cards);}
  if (localStorage.sortedBalls) {SORTEDBALLS = JSON.parse(localStorage.sortedBalls);}

  if (ALLCARDSOBJS) {
    ALLCARDSOBJS = ALLCARDSOBJS.map((element, i) => {
      element = new Card(element.id, element.name, element.numbers)
      element.markSorteds()
      return element;
    })
  }

  if (SORTEDBALLS) {
    const arr = SORTEDBALLS.concat()
    SORTEDBALLS = []
    SORTEDBALLS = arr.map((element) => {
      pushBall(element);
      return element
    })
  }
}

addCardBtn.addEventListener('click', addCard)
function addCard() {
  const cancelBtn = document.getElementById('cardInputCancel')
  const saveBtn = document.getElementById('cardInputSave')
  const newId = new Date().getTime().toString(32)
  const newArr = [];
  const cancel = () => {
    cancelBtn.removeEventListener('click', cancel)
    document.location.reload()
  }
  const save = () => {
    saveBtn.removeEventListener('click', save);
    ALLCARDSOBJS.push(newCard);
  }
  const newCard = new Card(newId, '', [])

  newCard.openCardEdit()

  cancelBtn.addEventListener('click', cancel)
  saveBtn.addEventListener('click', save)
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
  localStorage.cards = '[{"id":"181a8a33a05","name":"ALFREDO","numbers":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]},{"id":"181a8a3781f","name":"MARIA","numbers":[14,10,7,11,15,20,27,23,28,25,32,42,34,33,52,55,58,56,53,71,64,69,72,66]}]'
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

const cardInput = document.getElementById('cardInput')
cardInput.addEventListener('submit', saveAndCloseCardInput)

function saveAndCloseCardInput() {

  const currentId = cardInput.querySelector('#cardInputId').innerHTML;
  const currentCard = ALLCARDSOBJS.find((element) => {return currentId == element.id})

  const name = document.getElementById('cardInputName')
  const inputs = cardInputSection.querySelectorAll('input[class^="item"]');

  const newName = name.value;
  const newNumbers = [];
  inputs.forEach((element) => {newNumbers.push(Number(element.value))})

  currentCard.update(newName, newNumbers)
}



// balls *******************************************
const allBalls = document.getElementById('allBalls')
const balls = document.querySelectorAll('.ball')
const allBallsHistoric = document.getElementById('allBallsHistoric')
const ballHistoricModel = document.getElementById('ballHistoricModel')
const optionsBallsSection = document.getElementById('optionsBalls')
const inputBall = document.getElementById('inputBall')
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
inputBall.addEventListener('input', ofInputBall);
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

  allBallsHistoric.insertBefore(newBallHistoric, undoBallBtn.nextSibling)

  inputBall.value = '';
  tagLetterInput.innerHTML = ''
  pushBallBtn.setAttribute('disabled', '')
  tagOrderInput.innerHTML = SORTEDBALLS.length + 1 + '°';

  ALLCARDSOBJS.forEach((element) => {
    element.markSorteds(SORTEDBALLS)
  })

  markSortedBalls()
}

function undoBall() {
  const toRemove = undoBallBtn.nextElementSibling;
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

function ofInputBall() {
  const number = inputBall.value;
  const letter = getLetter(number)
  const order = SORTEDBALLS.length + 1 + '°'

  tagLetterInput.innerHTML = letter;
  tagOrderInput.innerHTML = order;

  if (SORTEDBALLS.includes(Number(number)) || number <= 0 || number > 75) {
    pushBallBtn.setAttribute('disabled', '')
  } else {
    pushBallBtn.removeAttribute('disabled')
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