function getArtistInfo() {
  var artist = document.querySelector('#artist').value;
  var req = new Request(
    `http://127.0.0.1:5000/artist/info?artist=${artist}`,
    {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  );

  fetch(req).then(response => {
    populateArtistInfo();
    
    return response.json();
  }).then(data => console.log(data));
}

function populateArtistInfo() {
  // Get artist name
  fetch('http://127.0.0.1:5000/artist/name')
    .then(response => {
      // console.log(response);
      return response.text();
    })
    .then(data => {
      document.querySelector('#artist-name').innerHTML = data;
    });

    // get artist image
    fetch('http://127.0.0.1:5000/artist/image')
    .then(response => {
        return response.text();
      })
      .then(data => {
        var element = document.createElement(`img`);
        element.setAttribute('src', data);
        document.querySelector('#artist-name').appendChild(element);
      });
}