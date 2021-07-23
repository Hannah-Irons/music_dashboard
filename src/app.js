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
    return response;
  });
}


