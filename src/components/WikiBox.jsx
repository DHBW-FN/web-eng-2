import React, { useContext } from 'react';
import { Sheet, BlockTitle, Fab, f7, Button, Icon } from 'framework7-react';
import Framework7 from 'framework7';
import { $ } from 'dom7';
import '../css/app.css';
import '../css/wikibox.css';
import { DEFAULT_WIKI, DestinationContext, OriginContext, CenterLocationContext } from '../js/Context';
import { setRoutingOriginDestination } from "./Routing";

export async function getWikipediaByCity(city) {
  return fetch(`https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&exsentences=10&titles=${city}`)
    .then(response => response.json())
    .then(json => {
      return json.query.pages[Object.keys(json.query.pages)[0]].extract || DEFAULT_WIKI;
    })
}

export default function WikiBox() {
  const { destination } = useContext(DestinationContext);
  const { origin } = useContext(OriginContext);
  const { centerLocation, setCenterLocation } = useContext(CenterLocationContext);

  let sheetProps = {
    className: 'wikibox-sheet',
    style: { height: 'auto' , maxHeight: '100%'},
    backdrop: true,
    swipeToClose: true,
    swipeToStep: true,
    closeByBackdropClick: true,
    closeOnEscape: true,
    onSheetOpen: async () => {
      setCenterLocation({
        ...centerLocation, wikipedia: await getWikipediaByCity(centerLocation.address.city)
      });
    }
  };
  if (Framework7.device.desktop) {
    sheetProps.swipeToStep = false;
  }

  async function startNavigation() {
    f7.sheet.close('.wikibox-sheet');
    setRoutingOriginDestination(origin.coordinates, destination.coordinates);
  }

  async function openWikibox() {
    f7.sheet.open($('.wikibox-sheet'));
    setCenterLocation({ ...centerLocation, wikipedia: await getWikipediaByCity(centerLocation.address.city) });
  }

  return (
    <>
      <Fab
        position="center-top"
        id="debug-fab-open-wikibox"
        text="Press to show info"
        onClick={openWikibox}></Fab>
      <Sheet {...sheetProps}>
        <div className="sheet-modal-inner">
          <div className="sheet-modal-swipe-step" id="wikibox-modal-city">
            <div className="display-flex padding justify-content-space-between align-items-center" id="wikibox-header">
              <h1>{centerLocation.address.city}</h1>
              <Button
                id="navigateButton"
                tooltip={'Navigate to ' + destination.address.city}
                onClick={startNavigation}>
                <Icon
                  id="navigateIcon"
                  material="directions"
                  size={$('#navigateButton').height()}
                />
              </Button>
            </div>
          </div>
          <div
            className="page-content"
            id="wikibox-page-content"
            style={{ maxHeight: window.innerHeight - $('#wikibox-modal-city').height()}}>
            <div className="padding-horizontal padding-bottom">
              {!Framework7.device.desktop ? (
                <div className="margin-top text-align-center">Swipe up for more details</div>
              ) : null}
            </div>
            <BlockTitle medium className="margin-top">
              Wiki
            </BlockTitle>
            <p>{centerLocation.wikipedia}</p>
          </div>
        </div>
      </Sheet>
    </>
  );
}
