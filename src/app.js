const server = 'http://127.0.01:5000';
const d3 = window.d3;

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
        let div = document.querySelector('#artist-image');
        div.innerHTML = '';
        div.appendChild(element);
        element.setAttribute('src', data);
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

      // Plotly.newPlot('Albumchart', chart);
    });
}

function getTopTracksInfo() {
  fetch(`${server}/artist/top-tracks`).then(response => {
      return response.json();
    })
    .then(data => {
      // console.log(data);
      tracks = Object.keys(data);
      chartData = [];
      tracks.forEach(t => {
        var trackData = {
          'track': t,
          'playcount': data[t]
        };
        chartData.push(trackData);
      });
      console.log(chartData);

      var margin = {
        top: 50,
        right: 40,
        bottom: 70,
        left: 100
      },
      width = 1000 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

      var svg = d3.select('#Trackchart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

      var x = d3.scaleBand()
        .domain(chartData.map(d => d.track)) // scale of x axis
        .range([0, width]);

      svg.append('g').attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(-10,0) rotate(-45)')
        .style('text-anchor','end');

      var y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => { return d.playcount; })]) // scale of y axis
        .range([height, 0]);

      svg.append('g').call(d3.axisLeft(y));

      svg.selectAll('rect')
        .data(chartData)
        .enter()
        .append('rect')
        .style('fill', 'steelblue')
        .attr('x', d => x(d.track))
        .attr('y', d => y(d.playcount))
        .attr('height', d => { return height - y(d.playcount); })
        .attr('width', x.bandwidth );
    });
}