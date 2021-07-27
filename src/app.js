const server = 'http://127.0.01:5000';

function getArtistInfo() {
  var artist = document.querySelector('#artist').value;
  var req = new Request(
    `${server}/artist/info?artist=${artist}`,
    {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  );

  fetch(req).then(response => {
    populateArtistInfo();
    getTopAlbumsInfo();
    getTopTracksInfo();
    return response.json();
  });
}

function populateArtistInfo() {
  // Get artist name
  fetch(`${server}/artist/name`)
    .then(response => {
      // console.log(response);
      return response.text();
    })
    .then(data => {
      document.querySelector('#artist-name').innerHTML = data;
    });

    // get artist image
    fetch(`${server}/artist/image`)
    .then(response => {
        return response.text();
      })
      .then(data => {
        var element = document.createElement(`img`);
        element.setAttribute('src', data);
        document.querySelector('#artist-image').appendChild(element);
      });

    // get artist biography
    fetch(`${server}/artist/bio`)
    .then(response => {
        return response.text();
      })
      .then(data => {
        document.querySelector('#artist-bio').innerHTML = data;
      });
    // get artist recommendations
    fetch(`${server}/artist/recs`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        document.querySelector('#artist-rec-1').innerHTML = data['1'];
        document.querySelector('#artist-rec-2').innerHTML = data['2'];
        document.querySelector('#artist-rec-3').innerHTML = data['3'];
      });
}

function getTopAlbumsInfo() {
    fetch(`${server}/artist/top-albums`).then(response => {      
      return response.json();
    })
    .then(data => {
      var chart = [{
        x: data.x,
        y: data.y,
        type: 'bar'
      }];

      Plotly.newPlot('Albumchart', chart);
    });
}

function getTopTracksInfo() {
  fetch(`${server}/artist/top-tracks`).then(response => {
      return response.json();
    })
    .then(data => {
      var chart = [{
        x: data.x,
        y: data.y,
        type: 'bar'
      }];

      Plotly.newPlot('Trackchart', chart);
    });
}

// function populateAlbumInfo() {
//   // Get artist name
//   fetch('http://127.0.0.1:5000/artist/Top_albums')
//     .then(response => {
//       // console.log(response);
//       return response.text();
//     })
//     .then(data => {
//       document.querySelector('#top-albums').innerHTML = data;
//     });