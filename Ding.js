import config from './config.json';

const key = config.key;
const token = config.token;
const board = config.board;
const keyword = '-top';

let cardMap = {};

function checkChanges() {
  fetch(`https://api.trello.com/1/boards/${board}/lists?key=${key}&token=${token}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(res => res.json())
  .then(data => {
    data.forEach(list => {
      // check if list name includes keyword
      if (list.name.includes(keyword)) {
        const listName = list.name;
        fetch(`https://api.trello.com/1/lists/${list.id}/cards?key=${key}&token=${token}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(res => res.json())
        .then(cards => {
          cards.forEach(card => {
            // check if card exists in cardMap
            if (cardMap.hasOwnProperty(card.id)) {
              // card exists, check if list has changed
              if (cardMap[card.id] !== card.idList) {
                fetch(`https://api.trello.com/1/lists/${cardMap[card.id]}?key=${key}&token=${token}&fields=name`, {
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json'
                  }
                })
                .then(res => res.json())
                .then(prevList => {
                  console.log(`Card ${card.name} has been moved from list ${prevList.name} to ${listName}`);
                  // update cardMap
                  cardMap[card.id] = card.idList;
                })
                .catch(error => console.log(error));
              }
            } else {
              // card doesn't exist, add to cardMap
              cardMap[card.id] = card.idList;
              console.log(`Card ${card.name} has been added to list ${listName}`);
            }
          });
        })
        .catch(error => console.log(error));
      }
    });
    console.log('No changes yet'); // if no changes in 10sec says this
  })
  .catch(error => console.log(error));
}

setInterval(checkChanges, 10000);