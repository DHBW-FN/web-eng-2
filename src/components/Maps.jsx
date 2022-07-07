import React, { useContext } from "react";
import {MapContainer, TileLayer, useMapEvents, useMap, ZoomControl} from "react-leaflet";
import "../css/leaflet.css";
import "../css/app.css";
import {Fab, Icon, PageContent} from "framework7-react";
import { RoutingState, CoordContext, AddressContext } from "../js/Context";
import Routing from "./Routing";

export default function Map(){

    const locateFabClickEvent = new Event('handleFabClick');
    const { routingActive } = useContext(RoutingState)
    const { coord, setCoord } = useContext(CoordContext)
    const { address } = useContext(AddressContext)

    function HandleClick(){
        const map = useMap()
        map.on("click", (e) => {
            setCoord(e.latlng)
        })
    }

    function HandleFabClick(){
        const map = useMap();
        addEventListener('handleFabClick', function () {map.locate()}, false);
    }

    function EventHandler() {
        const map = useMapEvents({
            locationfound(e) {
                setCoord(e.latlng)
                map.flyTo(e.latlng, 15)
            },
            locationerror() {
                alert("Unfortunately, we could not find your location")
            }
        })
        return null
    }

    function FlyToAddress(){
        const map = useMap()
        if(coord.lat != null && coord.lng != null){
            map.flyTo(coord)
        }
    }

    return (
        <>
            <Fab position="right-bottom" slot="fixed" id="fab-button" onClick={() => {
                dispatchEvent(locateFabClickEvent);
            }}>
                <Icon f7="placemark_fill" ios="f7:placemark_fill" aurora="f7:placemark_fill"></Icon>
            </Fab>
            <PageContent className='page-content-map'>
                <MapContainer center={[47.67989, 9.47554]} zoom={13} scrollWheelZoom={true} id="map" zoomControl={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ZoomControl position="bottomleft"/>
                    <HandleClick/>
                    <HandleFabClick/>
                    <EventHandler/>
                    <FlyToAddress/>
                    {routingActive ? <Routing/> : null}; {/*disabling isn't working right now*/}
                </MapContainer>
            </PageContent>
        </>
    );
}