import logo from "./Graviti.svg";
import dot from "./Ellipse.png";
import greenDot from "./Group 1.png";
import dest from "./Group 2.svg";
import addButton from "./Group 3.svg";

import {
  GoogleMap,
  Marker,
  useLoadScript,
  useJsApiLoader,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import { useRef, useState, useMemo } from "react";
import "./App.css";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  VStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
  HStack,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAYBivEevsC3sXYWfY6n9803tvASqB0TUI",
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();

  const stop = useRef();

  const [references, setReferences] = useState([
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const addReference = () => {
    setCurrentIndex(currentIndex + 1);
  };
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();

  if (!isLoaded) {
    return <SkeletonText />;
  }

  async function calculateRoute() {
    if (
      originRef.current?.value === "" ||
      destiantionRef.current?.value === ""
    ) {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    var directionsRequest = {
      origin: originRef.current?.value,
      waypoints: references.slice(0, currentIndex + 1).map((ref) => {
        return {
          location: ref.current?.value,
          stopover: true,
        };
      }),
      destination: destiantionRef.current?.value,
      // travelMode: google.maps.TravelMode.DRIVING,
      travelMode: "DRIVING",
    };
    var totalDistance = 0;
    const results = await directionsService.route(
      directionsRequest,
      function (response, status) {
        var distances = [];
        for (var i = 0; i < response.routes[0].legs.length; i++) {
          distances.push(response.routes[0].legs[i].distance);
        }
        distances.map((dis) => {
          totalDistance = totalDistance + dis.value / 1000;
        });
        console.log(totalDistance);
      }
    );
    setDirectionsResponse(results);
    setDistance(totalDistance);
  }

  const center = { lat: 28.6448, lng: 77.216721 };
  return (
    <div className="App">
      <div className="header">
        <div className="imageContainer">
          <img src={logo} alt="" />
        </div>
      </div>
      <div className="body">
        <div className="heading">
          <div className="headingContent">
            Let's calculate <b>distance</b> from Google maps
          </div>
        </div>
        <div className="mapContainer">
          <div className="location">
            <div className="innerBox">
              <VStack spacing={16}>
                <HStack spacing={12}>
                  <VStack spacing={4}>
                    <Box flexGrow={1}>
                      <Autocomplete>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <img src={greenDot} alt="" />{" "}
                          </InputLeftElement>
                          <Input
                            type="text"
                            placeholder="Origin"
                            ref={originRef}
                            backgroundColor="white"
                          />
                        </InputGroup>
                      </Autocomplete>
                    </Box>

                    {references.slice(0, currentIndex + 1).map((ref) => {
                      return (
                        <Box flexGrow={1}>
                          <Autocomplete>
                            <InputGroup>
                              <InputLeftElement pointerEvents="none">
                                <img src={dot} alt="" />{" "}
                              </InputLeftElement>
                              <Input
                                type="text"
                                placeholder="Stop"
                                ref={ref}
                                backgroundColor="white"
                              />
                            </InputGroup>
                          </Autocomplete>
                        </Box>
                      );
                    })}
                    <div className="addButton">
                      <Button
                        backgroundColor="azure"
                        onClick={() => addReference()}
                      >
                        <img src={addButton} alt="" />
                        <div style={{ marginLeft: "5px" }}></div> Add location
                      </Button>
                    </div>
                    {/* <Box flexGrow={1}>
                      <Autocomplete>
                        <Input
                          type="text"
                          placeholder="Stop"
                          ref={stop}
                          backgroundColor="white"
                        />
                      </Autocomplete>
                    </Box> */}
                    <Box flexGrow={1}>
                      <Autocomplete>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <img src={dest} alt="" />{" "}
                          </InputLeftElement>
                          <Input
                            type="text"
                            placeholder="Destination"
                            backgroundColor="white"
                            ref={destiantionRef}
                          />
                        </InputGroup>
                      </Autocomplete>
                    </Box>
                  </VStack>
                  <ButtonGroup>
                    <Button
                      className="calculateButton"
                      type="submit"
                      borderRadius="1.5rem"
                      onClick={calculateRoute}
                    >
                      Calculate
                    </Button>
                  </ButtonGroup>
                </HStack>
                <VStack width="70%" spacing={4}>
                  <Box
                    width="100%"
                    borderWidth="0.5px"
                    borderRadius="md"
                    bg="white"
                    px={4}
                    h={20}
                  >
                    <div className="distanceContainer">
                      <div className="distance">Distance:</div>
                      <div className="unit">{distance} Kms</div>
                    </div>
                  </Box>
                  {!(destiantionRef.current?.value === "") && (
                    <Text
                      width="100%"
                      fontFamily="Work Sans"
                      fontSize="14px"
                      fontWeight="400"
                    >
                      The distance between <b>{originRef.current?.value}</b> and{" "}
                      <b>{destiantionRef.current?.value}</b> via the seleted
                      route is <b>{distance}</b> kms.
                    </Text>
                  )}
                </VStack>
              </VStack>
            </div>
          </div>
          <div className="map">
            <div className="mapBox">
              {!isLoaded ? (
                <h1>Loading...</h1>
              ) : (
                <GoogleMap
                  mapContainerClassName="map-container"
                  center={center}
                  zoom={7}
                  options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                  onLoad={(map) => setMap(map)}
                >
                  <Marker
                    position={center}
                    icon={
                      "http://maps.google.com/mapfiles/ms/icons/mm_20_red.png"
                    }
                  />
                  {directionsResponse && (
                    <DirectionsRenderer directions={directionsResponse} />
                  )}
                </GoogleMap>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
