import React, { useContext, useState } from 'react';
import '../css/Searchbar.css';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import {CoordContext, DestinationContext} from '../js/Context';
import { AddressContext } from '../js/Context';
import { getObjectByCoordinates } from "./Maps";

export default function SearchBar() {
  const { setCoord } = useContext(CoordContext);
  const { setAddress } = useContext(AddressContext);
  const { setDestination } = useContext(DestinationContext);

  //this way the global address only gets set when the user makes a selection
  const [searchAddress, setSearchAddress] = useState('');

  const handleSelect = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);

    setDestination(getObjectByCoordinates(latLng.lat, latLng.lng));

    setCoord(latLng);
    setAddress(value);
    setSearchAddress(value);
  };

  return (
    <>
      <div className="searchElement">
        <PlacesAutocomplete
          value={searchAddress}
          onChange={setSearchAddress}
          onSelect={handleSelect}>
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div id="innerSearchdiv">
              <input id="searchInput" {...getInputProps({ placeholder: 'Type address ...' })} />
              <div id="autocompletion-examples">
                {loading ? <div>...loading</div> : null}

                {suggestions.map((suggestion) => {
                  const style = {
                    backgroundColor: suggestion.active ? '#C9C9C9' : '#fff'
                  };
                  return (
                    <div
                      key={suggestion.placeId}
                      {...getSuggestionItemProps(suggestion, { style })}>
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>
    </>
  );
}
