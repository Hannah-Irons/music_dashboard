from requests import api
import services.lastfm as lastfm
from flask import Flask, request, render_template
from flask_cors import CORS, cross_origin
import services.state as state

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/artist/info', methods=['GET'])
@cross_origin()
def getArtistInfo():
  artist = request.args.get('artist')
  info = lastfm.get_artist_info(artist)
  return info


@app.route('/artist/name', methods=['GET'])
@cross_origin()
def getArtistName():
  return state.artist_name

@app.route('/artist/image', methods=['GET'])
@cross_origin()
def getArtistImage():
  return state.artist_image_url

if __name__ == '__main__':
  app.run(debug=False)
