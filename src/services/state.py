# Data wranglilng step one - assign all objects from the json responses
import numpy as np
import pandas as pd
import plotly.graph_objs as go
import plotly.express as px

# Artist name
artist_name = ''
artist_image_url = ''
artist_bio = ''
recommend_similar_1 = ''
recommend_similar_2 = ''
recommend_similar_3 = ''
album_df = []
tracks_df = []

def set_artist_info(response):
  global artist_name, artist_bio, recommend_similar_1, recommend_similar_2, recommend_similar_3
  artist_name = response['artist']['name']
  artist_bio = response['artist']['bio']['summary']
  recommend_similar_1 = response['artist']['similar']['artist'][0]['name']
  recommend_similar_2 = response['artist']['similar']['artist'][1]['name']
  recommend_similar_3 = response['artist']['similar']['artist'][2]['name']

def set_top_albums(response):
  global album_df
  album_list = [(i['name'], i['playcount'])
    for i in response['topalbums']['album']]
  df = pd.DataFrame(album_list, columns=['album', 'playcount']).sort_values(
      'playcount', ascending=False)
  # graph = go.Scatter(x= df['album'].tolist(), y=df['playcount'].tolist(), mode='lines', name='album')
  # graph = df.values.tolist() 
  # print(graph)
  chartData = {'x': df['album'].tolist(), 'y': df['playcount'].tolist()}
  album_df = chartData
  

def set_top_tracks(response):
  global tracks_df
  data = {}
  for i in response['toptracks']['track']:
    data[i['name']] = int(i['playcount'])
  tracks_df = data