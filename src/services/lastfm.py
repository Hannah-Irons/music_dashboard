# This file contains all methods for interacting with lastfm api

# Imports
import re
import requests
from app import state
# import state
import xml.etree.ElementTree as ET

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
  response = requests.get(url, headers=headers, params=params).json()
  mbid = response['artist']['mbid']
  state.artist_image_url = getImageUrl(mbid)
  state.set_artist_info(response)
  # print(state.artist_image_url)
  return response

# get_top_albums
def get_top_albums():
  params['method'] = 'artist.getTopAlbums'
  params['artist'] = state.artist_name
  response = requests.get(url, headers=headers, params=params).json()
  state.set_top_albums(response)
  return response

# get_top_tracks
def get_top_tracks():
  params['method'] = 'artist.getTopTracks'
  params['artist'] = state.artist_name
  response = requests.get(url, headers=headers, params=params).json()
  state.set_top_tracks(response)
  print(response)
  return response

def getImageUrl(mbid):
  url = 'https://musicbrainz.org/ws/2/artist/' + mbid + '?inc=url-rels&fmt=json'
  image_url = 'https://wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity='

  response = requests.get(url).json()
  relations = response['relations']
  wikidata = {}

  for index, elem in enumerate(relations):
    if elem['type'] == 'wikidata':
      wikidata = relations[index]

  match = re.search('wiki/(.+)', wikidata['url']['resource'])
  if match:
    image_url = image_url + match.group(1) + '&format=json'
  
  image_name = requests.get(image_url).json(
  )['claims']['P18'][0]['mainsnak']['datavalue']['value'].replace(' ', '_')
  return 'https://commons.wikimedia.org/w/index.php?title=special:Redirect/file/' + image_name

# get_artist_info('rihanna')


