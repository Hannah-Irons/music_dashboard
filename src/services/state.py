# Data wranglilng step one - assign all objects from the json responses

artist_name = ''
artist_image_url = ''

def grab_for_case(grab_from, for_case, equal_case):
  """ grabing an item for a particular value """
  for index, elem in enumerate(grab_from):
    if elem[for_case] == equal_case:
      case_item = elem['#text']
  return case_item

# Artist name

artist_name = ''

# Artist image(s)

# Top Albums

# Top Tracks

# Similar Artist recommendations
