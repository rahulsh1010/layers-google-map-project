import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, useJsApiLoader } from "@react-google-maps/api";
import {
  FaEye,
  FaEyeSlash,
  FaHospital,
  FaStore,
  FaHome,
  FaSchool,
  FaUtensils,
  FaShoppingCart,
  FaHotel,
  FaPills,
  FaTree,
  FaBus,
  FaFilm,
  FaFire,
} from "react-icons/fa"; // Import additional icons
import { MdApartment } from "react-icons/md";
import styled from "styled-components";

interface Layer {
  name: string;
  visible: boolean;
  data: string; // URL to GeoJSON or inline GeoJSON data
  geoJson?: google.maps.Data; // Store the loaded Data object for toggling visibility
  icon: React.ReactNode; // Add the 'icon' property to store React components
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  position: relative;
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
  height: 100%;
`;

const Panel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 280px;
  height: 500px;
  background-color: #222;
  color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  z-index: 2;
  overflow-y: auto;
`;

// const PanelHeading = styled.h3`
//   background-color: #333; /* Darker background for heading */
//   color: #fff; /* White text */
//   padding: 10px 15px; /* Add padding inside the heading */
//   margin: -20px -20px 15px -20px; /* Stretch it full width by resetting padding */
//   font-size: 1.2rem; /* Slightly larger font */
//   text-align: left; /* Align text to the left */
//   border-bottom: 2px solid #444; /* Add a subtle bottom border */
//   border-radius: 12px 12px 0 0; /* Rounded corners only at the top */
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Optional shadow */
// `;

const RightPanel = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 280px;
  height: 500px;
  background-color: #222;
  color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  z-index: 2;
  overflow-y: auto;
`;

const LayerList = styled.ul`
  list-style: none;
  padding: 0;
`;
// const LayerItem = styled.li<{ active: boolean }>`
//   padding: 10px 15px;
//   background-color: ${(props) => (props.active ? "#444" : "transparent")};
//   display: flex;
//   justify-content: space-between; /* Eye icon to far right */
//   align-items: center; /* Vertically center items */
//   cursor: pointer;
//   border-radius: 8px;
//   transition: background-color 0.3s ease, transform 0.2s ease;

//   &:hover {
//     background-color: #555;
//     transform: scale(1.05);
//   }

//   .layer-details {
//     display: flex; /* Align icon and text horizontally */
//     align-items: center; /* Vertically center items */
//     gap: 12px; /* Space between icon and text */
//     font-size: 1rem;
//     color: ${(props) =>
//       props.active ? "#fff" : "#aaa"}; /* Light grey when inactive */
//     transition: color 0.3s ease;
//   }

//   .layer-details svg {
//     display: inline-block;
//     font-size: 1.2rem;
//     color: ${(props) =>
//       props.active ? "#fff" : "#777"}; /* Grey out icon if inactive */
//     transition: color 0.3s ease;
//   }

//   .eye-icon {
//     cursor: pointer;
//     color: #ddd;
//     transition: color 0.3s ease;

//     &:hover {
//       color: #fff;
//     }

//     svg {
//       font-size: 1.2rem;
//     }
//   }
// `;

// const RightPanelDetails = styled.div`
//   padding: 20px;
//   background-color: #f4f4f4;
//   border: 1px solid #ccc;
//   border-radius: 8px;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//   color: #333;
//   margin-top: 20px;

//   h4 {
//     font-size: 18px;
//     font-weight: 600;
//     color: #333;
//     margin-bottom: 10px;
//     margin-top: 0;
//   }

//   p {
//     font-size: 16px;
//     color: #666;
//     margin: 8px 0;
//   }

//   .details-message {
//     font-size: 16px;
//     color: #999;
//     text-align: center;
//     margin-top: 20px;
//   }
// `;

const PanelHeading = styled.h3`
  background-color: #333;
  color: #fff;
  padding: 10px 15px;
  margin: -20px -20px 15px -20px;
  font-size: 1rem; /* Reduced font size */
  text-align: left;
  border-bottom: 2px solid #444;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const LayerItem = styled.li<{ active: boolean }>`
  padding: 8px 15px; /* Reduced padding */
  background-color: ${(props) => (props.active ? "#444" : "transparent")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #555;
    transform: scale(1.05);
  }

  .layer-details {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.9rem; /* Reduced font size */
    color: ${(props) => (props.active ? "#fff" : "#aaa")};
    transition: color 0.3s ease;
  }

  .layer-details svg {
    display: inline-block;
    font-size: 1rem; /* Reduced icon size */
    color: ${(props) => (props.active ? "#fff" : "#777")};
    transition: color 0.3s ease;
  }

  .eye-icon {
    cursor: pointer;
    color: #ddd;
    transition: color 0.3s ease;

    &:hover {
      color: #fff;
    }

    svg {
      font-size: 1rem; /* Reduced icon size */
    }
  }
`;

const RightPanelDetails = styled.div`
  padding: 15px; /* Reduced padding */
  background-color: #f4f4f4;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #333;
  margin-top: 20px;

  h4 {
    font-size: 16px; /* Reduced title font size */
    font-weight: 600;
    color: #333;
    margin-bottom: 8px; /* Reduced margin */
    margin-top: 0;
  }

  p {
    font-size: 14px; /* Reduced paragraph font size */
    color: #666;
    margin: 6px 0; /* Reduced margin */
  }

  .details-message {
    font-size: 14px; /* Reduced font size */
    color: #999;
    text-align: center;
    margin-top: 20px;
  }
`;

const generateRandomData = () => {
  const randomDescription = `This is a random description for the layer. The layer contains ${Math.floor(
    Math.random() * 100
  )} items.`;
  return randomDescription;
};

const getLayerDetails = (layer: Layer) => {
  if (layer.name === "City - Gurgaon") {
    return (
      <>
        <h4>Location:</h4>
        <p>Gurgaon, Sector 25, Near NH-48</p>

        <h4>Number of Hospitals:</h4>
        <p>{Math.floor(Math.random() * 50)} Hospitals</p>

        <h4>Nearby Facilities:</h4>
        <p>Pharmacy, Parking, Ambulance</p>
      </>
    );
  } else if (layer.name === "Schools and Colleges") {
    return (
      <>
        <h4>Location:</h4>
        <p>Gurgaon, Sector 43, Near Golf Course Road</p>

        <h4>Number of Schools:</h4>
        <p>{Math.floor(Math.random() * 30)} Schools</p>

        <h4>Nearby Facilities:</h4>
        <p>Library, Sports Grounds, Cafeteria</p>
      </>
    );
  } else {
    return (
      <>
        <h4>Location:</h4>
        <p>Random Location: {generateRandomData()}</p>

        <h4>Number of Items:</h4>
        <p>{Math.floor(Math.random() * 100)} Items</p>

        <h4>Additional Information:</h4>
        <p>{generateRandomData()}</p>
      </>
    );
  }
};

const MapWithLayers: React.FC = () => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const [layers, setLayers] = useState<Layer[]>([
    {
      name: "City - Gurgaon",
      visible: true,
      data: "/Location.geojson",
      icon: <FaHome />,
    },
    {
      name: "Hospitals",
      visible: false,
      data: "/Hospitals.geojson",
      icon: <FaHospital />,
    },
    {
      name: "General Stores",
      visible: false,
      data: "/Stores.geojson",
      icon: <FaStore />,
    },
    {
      name: "Apartments",
      visible: false,
      data: "/Apartments.geojson",
      icon: <MdApartment />,
    },
    {
      name: "Schools and Colleges",
      visible: false,
      data: "/Schools.geojson",
      icon: <FaSchool />,
    },
    {
      name: "Restaurants",
      visible: false,
      data: "/Restaurants.geojson",
      icon: <FaUtensils />,
    },
    {
      name: "Hypermarkets",
      visible: false,
      data: "/Markets.geojson",
      icon: <FaShoppingCart />,
    },
    {
      name: "Hotels",
      visible: false,
      data: "/Hotels.geojson",
      icon: <FaHotel />,
    },
    {
      name: "Pharmacy",
      visible: false,
      data: "/Pharmacy.geojson",
      icon: <FaPills />,
    },
    {
      name: "Parks",
      visible: false,
      data: "/Parks.geojson",
      icon: <FaTree />,
    },
    {
      name: "Shopping Malls",
      visible: false,
      data: "/Malls.geojson",
      icon: <FaShoppingCart />,
    },
    {
      name: "Public Transport",
      visible: false,
      data: "/Transport.geojson",
      icon: <FaBus />,
    },
    {
      name: "Cinemas",
      visible: false,
      data: "/Cinemas.geojson",
      icon: <FaFilm />,
    },
    {
      name: "Gas Stations",
      visible: false,
      data: "/GasStations.geojson",
      icon: <FaFire />,
    },
  ]);

  const [googleMapsApiLoaded, setGoogleMapsApiLoaded] =
    useState<boolean>(false);
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places", "geometry"],
  });

  useEffect(() => {
    if (isLoaded) {
      setGoogleMapsApiLoaded(true);
    }
  }, [isLoaded]);

  const loadGeoJsonLayer = (map: google.maps.Map, layer: Layer) => {
    if (!layer.geoJson) {
      const dataLayer = new google.maps.Data();
      dataLayer.loadGeoJson(layer.data);
      dataLayer.setMap(map);
      layer.geoJson = dataLayer;
    }
  };

  const toggleLayerVisibility = (index: number) => {
    const newLayers = [...layers];
    newLayers[index].visible = !newLayers[index].visible;
    setLayers(newLayers);
    setSelectedLayer(newLayers[index]);
  };

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    layers.forEach((layer) => {
      if (layer.visible) {
        loadGeoJsonLayer(map, layer);
      }
    });
  };

  useEffect(() => {
    if (googleMapsApiLoaded && mapRef.current) {
      layers.forEach((layer) => {
        const dataLayer = layer.geoJson;
        if (dataLayer) {
          dataLayer.setMap(layer.visible ? mapRef.current : null);
        }
      });
    }
  }, [layers, googleMapsApiLoaded]);

  return (
    <Container>
      <Panel>
        <PanelHeading>Layers</PanelHeading>
        <LayerList>
          {layers.map((layer, index) => (
            <LayerItem
              key={index}
              active={layer.visible}
              onClick={() => setSelectedLayer(layer)}
            >
              <div className="layer-details">
                {layer.icon}
                <span>{layer.name}</span>
              </div>
              <div
                className="eye-icon"
                onClick={() => toggleLayerVisibility(index)}
              >
                {layer.visible ? <FaEye /> : <FaEyeSlash />}
              </div>
            </LayerItem>
          ))}
        </LayerList>
      </Panel>

      <RightPanel>
        <PanelHeading>Layer details</PanelHeading>
        {selectedLayer ? (
          <RightPanelDetails>
            {getLayerDetails(selectedLayer)}
          </RightPanelDetails>
        ) : (
          <div className="details-message">
            <p>Select a layer from the list to view its details.</p>
          </div>
        )}
      </RightPanel>

      <MapContainer>
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={{ width: "100vw", height: "100vh" }}
            center={{ lat: 28.6139, lng: 77.209 }}
            zoom={10}
            onLoad={onMapLoad}
          ></GoogleMap>
        </LoadScript>
      </MapContainer>
    </Container>
  );
};

export default MapWithLayers;
