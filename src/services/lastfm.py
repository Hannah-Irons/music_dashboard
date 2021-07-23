# This file contains all methods for interacting with lastfm api

# Imports
import requests
import json

from werkzeug.wrappers import response

# API credentials
apiKey = 'b3962e59096e397a8034d5ac02284e9b'
apiSecret = '56f0809946a5ef06bf9b7510d00e08f2'

# Request headers
url = 'https://ws.audioscrobbler.com/2.0/'
headers = {
  'user-agent': 'Dataquest',
  'content-type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

# Request params
params = {
  'api_key': apiKey,
  'autocorrect': 1,
  'format': 'json',
}

# build_request
def build_request(params):
  response = requests.get(url, headers=headers, params=params).json()
  return response


# get_artist_info
def get_artist_info(artist):
  params['method'] = 'artist.getinfo'
  params['artist'] = artist
  return requests.get(url, headers=headers, params=params).json()

# get_top_albums
def get_top_albums(artist):
  params['method'] = 'artist.getTopAlbums'
  params['artist'] = artist
  return build_request(params)

# get_top_tracks
def get_top_tracks(artist):
  params['method'] = 'artist.getTopTracks'
  params['artist'] = artist
  return build_request(params)

def hello_world():
  return 'hello world'

# print(get_artist_info('rhianna'))
