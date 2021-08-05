// This script ...


// hosted on your local server. port 5000.
const server = 'http://127.0.01:5000';
// using d3 as a plotting package
const d3 = window.d3;

function getArtistInfo() {
  cleanUI();
  var artist = document.querySelector('#artist').value;
  artist = artist.replace(' ', '+');
  var req = new Request(
    `${server}/artist/info?artist=${artist}`,
    {
      method: 'GET',
    }
  );
  
  // the response is a call back from the fetch request
  fetch(req).then(response => {
    populateArtistInfo();
    getTopAlbumsInfo();
    getTopTracksInfo();
    document.querySelector('.spinner').style.display = 'none';
    document.querySelector('.artist__info').style.display = 'flex';
    return response.json();
  });
}

function cleanUI() {
  document.querySelector('.spinner').style.display = 'flex';
  document.querySelector('.artist__info').style.display = 'none';
  document.querySelector('.charts__tracks').innerHTML = '';
  document.querySelector('.charts__albums').innerHTML = '';
  document.querySelector('.charts__options').innerHTML = '';
  document.querySelector('.charts__album__options').innerHTML = '';
}

function populateArtistInfo() {
  // Get artist name
  fetch(`${server}/artist/name`)
    .then(response => {
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
      const options = [{
          label: 'Alphabetical',
          value: (a, b) => d3.ascending(a.album, b.album)
        },
        {
          label: 'Playcount, ascending',
          value: (a, b) => a.playcount - b.playcount
        },
        {
          label: 'Playcount, descending',
          value: (a, b) => b.playcount - a.playcount
        }
      ];
      var template = document.createElement('template');
      var html = `
      <form>
        <select name=i>
          ${options.map(o => `
            <option value="${o.label}">
              ${o.label}
            </option>
          `)}
        </select>
      </form>`;
      html = html.trim();
      template.innerHTML = html;

      var form = document.querySelector('.charts__album__options').appendChild(template.content.firstChild);

      albums = Object.keys(data);
      chartData = [];
      albums.forEach(n => {
        var albumData = {
          'album': n,
          'playcount': data[n]
        };
        chartData.push(albumData);
      });
      // console.log(chartData)

      var margin = {
          top: 50,
          right: 40,
          bottom: 80,
          left: 100
        },
        width = 1200 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      var svg = d3.select('.charts__albums')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

      // define x axis scale/ticks
      var x = d3.scaleBand()
        .domain(chartData.map(d => d.album))
        .range([0, width])
        .padding(0.1);

      // store reference to x axix in a variable
      var xAxis = svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x));

      // break method chaining so we don't store a selection of text elements
      xAxis
        .selectAll('text')
        .attr('transform', 'translate(-10,0) rotate(-45)')
        .style('text-anchor', 'end');

      var y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => {
          return d.playcount;
        })])
        .range([height, 0]);

      svg.append('g')
        .attr('class', '.yaxis')
        .call(d3.axisLeft(y));

      svg.selectAll('rect')
        .data(chartData)
        .enter()
        .append('rect')
        .style('fill', 'orange')
        .attr('x', d => x(d.album))
        .attr('y', d => y(d.playcount))
        .attr('height', d => {
          return height - y(d.playcount);
        })
        .attr('width', x.bandwidth);

      // adding an event listener to form
      form.onchange = () => {
        setTimeout(() => {
          svg.selectAll('rect')
            .sort(options[form.i.selectedIndex].value)
            .call(rects =>
              x.domain(rects.data().map(d => d.album))
            )
            .transition()
            .duration(500)
            .attr('x', d => x(d.album));

          // transition the x axis to reflect the new data:
          xAxis.transition().call(d3.axisBottom(x));
        }, 500);
      };

    });
}

function getTopTracksInfo() {
  fetch(`${server}/artist/top-tracks`).then(response => {
      return response.json();
    })
    .then(data => {
      const options = [
        { label: 'Alphabetical', value: (a, b) => d3.ascending(a.track, b.track) },
        { label: 'Playcount, ascending', value: (a,b) => a.playcount - b.playcount },
        { label: 'Playcount, descending', value: (a,b) => b.playcount - a.playcount}
      ];
      var template = document.createElement('template');
      var html = `
      <form>
        <select name=i>
          ${options.map(o => `
            <option value="${o.label}">
              ${o.label}
            </option>
          `)}
        </select>
      </form>`;
      html = html.trim();
      template.innerHTML = html;

      var form = document.querySelector('.charts__options').appendChild(template.content.firstChild);

      tracks = Object.keys(data);
      chartData = [];
      tracks.forEach(t => {
        var trackData = {
          'track': t,
          'playcount': data[t]
        };
        chartData.push(trackData);
      });
      // console.log(chartData)

      var margin = {
        top: 50,
        right: 40,
        bottom: 80,
        left: 100
      },
      width = 1200 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

      var svg = d3.select('.charts__tracks')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

      var x = d3.scaleBand()
        .domain(chartData.map(d => d.track))
        .range([0, width])
        .padding(0.1);

      // store g in variable
      var xAxis = svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x));

      // break method chaining so we don't store a selection of text elements
      xAxis
        .selectAll('text')
        .attr('transform', 'translate(-10,0) rotate(-45)')
        .style('text-anchor', 'end');

      var y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => { return d.playcount; })])
        .range([height, 0]);

      svg.append('g')
        .attr('class', '.yaxis')
        .call(d3.axisLeft(y));

      svg.selectAll('rect')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('class', '.bar')
        .style('fill', 'steelblue')
        .attr('x', d => x(d.track))
        .attr('y', d => y(d.playcount))
        .attr('height', d => { return height - y(d.playcount); })
        .attr('width', x.bandwidth );
      
      form.onchange = () => {
        setTimeout(() => {
          svg.selectAll('rect')
            .sort(options[form.i.selectedIndex].value)
            .call(function (rects) {
              x.domain(rects.data().map(d => d.track));
            })
            .transition()
            .duration(500)
            .attr('x', d => x(d.track));

          // transition the x axis to reflect the new data:
          xAxis.transition().call(d3.axisBottom(x));
        }, 500);
      };
    });
}