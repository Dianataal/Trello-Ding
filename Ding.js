import config from './config.json';

const key = config.key;
const token = config.token;
const board = config.board;


let cardMap = {};

function checkChanges() {
  fetch(`https://api.trello.com/1/boards/${board}/cards?key=${key}&token=${token}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(res => res.json())
  .then(data => {
    data.forEach(task => {
      // check if list name includes -top
      if (task.idList) {
        fetch(`https://api.trello.com/1/lists/${task.idList}?key=${key}&token=${token}&fields=name`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(res => res.json())
        .then(list => {
          if (list.name.includes('-top')) {
            const topListName = list.name;
            // check if card exists in cardMap
            if (cardMap.hasOwnProperty(task.id)) {
              // card exists, check if list has changed
              if (cardMap[task.id] !== task.idList) {
                fetch(`https://api.trello.com/1/lists/${cardMap[task.id]}?key=${key}&token=${token}&fields=name`, {
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json'
                  }
                })
                .then(res => res.json())
                .then(prevList => {
                  if (prevList.name.includes('-top')) {
                    console.log(`Card ${task.name} has been moved from list ${prevList.name} to ${topListName}`);
                  } else {
                    console.log(`Card ${task.name} has been added to list ${topListName}`);
                  }
                  // new list added
                  cardMap[task.id] = task.idList;
                })
                .catch(error => console.log(error));
              }
            } else {
              // card doesn't exist, add to cardMap
              cardMap[task.id] = task.idList;
              console.log(`Card ${task.name} has been added to list ${topListName}`);
            }
          } else {
            // card is not in a list with -top in the name
            if (cardMap.hasOwnProperty(task.id)) {
              // card exists, check if it was removed. not working as intended
              fetch(`https://api.trello.com/1/lists/${cardMap[task.id]}?key=${key}&token=${token}&fields=name`, {
                method: 'GET',
                headers: {
                  'Accept': 'application/json'
                }
              })
              .then(res => res.json())
              .then(prevList => {
                if (prevList.name.includes('-top')) {
                  console.log(`Card ${task.name} has been moved from list ${prevList.name}`);
                } else {
                  console.log(`Card ${task.name} has been deleted`);
                }
                // this doesn't work properly. maybe archiving makes sth idk?
                delete cardMap[task.id];
              })
              .catch(error => console.log(error));
            }
          }
        })
        .catch(error => console.log(error));
      }
    });
    console.log('No changes yet'); // if no changes in 10sec says this
  })
  .catch(error => console.log(error));
}

setInterval(checkChanges, 10000);