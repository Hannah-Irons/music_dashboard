from requests import api
import services.lastfm as lastfm
from flask import Flask, request, render_template
from flask_cors import CORS, cross_origin
import services.state as state

# Flask builds the web frame work.
# CORS is Cross Origin Resource Sharing, allows the JSON responses to be passed 
# from lastFM up the chain, must = 'Content-Type'.

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Create the routes, in these example the API end points. The route methods are all 
# 'GETS' which are requesting infomation and returning it. 
# The 'state' in the return is the file that is processesing the responses. 
#  
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

@app.route('/artist/bio', methods=['GET'])
@cross_origin()
def getArtistBio():
  return state.artist_bio


@app.route('/artist/recs', methods=['GET'])
@cross_origin()
def getArtistRecs():
  return {'1': state.recommend_similar_1, '2': state.recommend_similar_2, '3': state.recommend_similar_3}

@app.route('/artist/top-albums', methods=['GET'])
@cross_origin()
def getTopAlbums():
  lastfm.get_top_albums()
  return state.album_df

@app.route('/artist/top-tracks', methods=['GET'])
@cross_origin()
def getTopTracks():
  lastfm.get_top_tracks()
  return state.tracks_df

# not sure what this line is doing
if __name__ == '__main__':
  app.run(debug=False)