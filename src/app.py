from flask.helpers import make_response
from requests import api
import services.lastfm as api
from flask import Flask, jsonify, request, Response
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/artist/info', methods=['GET'])
@cross_origin()
def getArtistInfo():
  artist = request.args.get('artist')
  info = api.get_artist_info(artist)
  return info

if __name__ == '__main__':
  app.run(debug=False)
