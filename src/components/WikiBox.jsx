import React, { useState } from 'react';
import {
  Page,
  Button,
  Sheet,
  BlockTitle,
  Icon,
} from 'framework7-react';
import Framework7 from 'framework7/types';

export default function WikiBox() {
    const [wikipedia, setWikipedia] = useState(["Waiting for article..."])
    const city = "München"

    function wikipediaLookup(city){
        fetch(`https://de.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${city}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setWikipedia(data.query.pages[Object.keys(data.query.pages)[0]].extract)
            })
    }
 function wikiSheetContent(){
        return (
            <>
                <div className="sheet-modal-inner">
                <div className="sheet-modal-swipe-step">
                  <div className="display-flex padding justify-content-space-between align-items-center">

                      <h1>{city}:</h1>
                      <Icon f7='location'></Icon>
                  </div>
                  
                  <div className=" text-align-center"></div>
              </div>
              <div className="page-content" style={{height: "auto", maxHeight: "100vh"}}>
              <BlockTitle medium className="margin-top">
                  Wiki
              </BlockTitle>
              <p>
                  {wikipedia}
              </p>
              </div>
              </div>
              </>
        )
    }

    return (
      <Page>
          <Button fill id="press_on_Location_Icon" sheetOpen=".wikibox-sheet" onClick={() => wikipediaLookup(city)}>
              Press to show info
          </Button>
          {Framework7.device.desktop ? (
          <Sheet
              className="wikibox-sheet"
              style={{ height: 'auto', maxHeight: '100%','--f7-sheet-bg-color': '#fff' }}
              backdrop
              swipeToClose
              closeOnEscape
              closeByBackdropClick
          >
              {wikiSheetContent()}
              
          </Sheet>
          ) :
          (
            <Sheet
            className="wikibox-sheet"
            style={{ height: 'auto', maxHeight: '100%', '--f7-sheet-bg-color': '#fff' }}
            backdrop
            swipeToStep
            swipeToClose
            closeOnEscape
            closeByBackdropClick
        >
           {wikiSheetContent()}
        </Sheet>
        )}
      </Page>
    );
}
