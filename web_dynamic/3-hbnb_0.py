#!/usr/bin/python3
""" Starts a Flash Web Application """
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from os import environ
from flask import Flask, render_template
import uuid


app = Flask(__name__)
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/3-hbnb/', strict_slashes=False)
def hbnb():
    """ HBNB is alive! """
    states = storage.all(State).values()
    states = sorted(states, key=lambda k: k.name)
    st_ct = []

    for state in states:
        st_ct.append([state, sorted(state.cities, key=lambda k: k.name)])

    amenities = storage.all(Amenity).values()
    amenities = sorted(amenities, key=lambda k: k.name)

    places = storage.all(Place).values()
    places = sorted(places, key=lambda k: k.name)

    # Generate a unique cache_id using uuid
    cache_id = str(uuid.uuid4())

    return render_template('3-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           cache_id=cache_id)


@app.route('/api/v1/places_search', methods=['POST'], strict_slashes=False)
def places_search():
    """ Search places based on JSON parameters """
    data = request.get_json()
    if not data:
        abort(400, 'Not a JSON')

    states = data.get('states', [])
    cities = data.get('cities', [])
    amenities = data.get('amenities', [])

    places = storage.all(Place).values()

    if states:
        places = [place for place in places if place.city.state_id in states]
    if cities:
        places += [place for place in places if place.city_id in cities]
    if amenities:
        amenities_set = set(amenities)
        places = [place for place in places if amenities_set.issubset({a.id
                  for a in place.amenities})]

    places_list = []
    for place in places:
        places_list.append(place.to_dict())

    return jsonify(places_list)


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000)
