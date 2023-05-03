fetch (`https://api.trello.com/1/boards/${board}/cards?key=${key}&token=${token}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(res => {
      console.log(res);
      return res.json();
    })
    .then(data => {
        data.forEach(task => {
          console.log(task.name, task.start, task.due);
        });
      })
      .catch(error => console.log(error));