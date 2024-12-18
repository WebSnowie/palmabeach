"use client"
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import L from 'leaflet';
import { useEffect, useRef } from 'react';

// Define center coordinates
const center: [number, number] = [-8.8833, 116.2833];

// Fix for default marker icon
const customIcon = L.divIcon({
  className: "custom-icon",
  html: `
      <svg viewBox="0 0 512 512" width="32px" height="32px" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 512 512" xml:space="preserve">
<path style="fill:#F24141;" d="M416.557,246.349c-0.931,23.042-2.713,45.944-5.344,67.81
	c-8.709,72.281-24.963,118.54-45.117,145.051c-37.282-17.267-77.777-25.336-118.062-24.206c0.827-3.237,1.583-6.485,2.305-9.757
	c5.612-25.673,8.034-52.406,6.881-79.721c-0.291-6.823-0.803-13.681-1.549-20.574c-0.466-4.32-1.025-8.604-1.665-12.866
	c-1.316-8.814-2.992-17.488-5.007-26.011c4.727-35.919,12.237-73.678,21.54-109.563C295.677,79.525,333.972-3.747,366.2,0.13
	c27.734,3.342,44.512,70.418,49.542,152.887C417.57,182.871,417.861,214.738,416.557,246.349z"/>
<path style="fill:#F97D7D;" d="M416.557,246.349c-41.985,6.974-103.858,24.032-162.551,65.738
	c-1.316-8.814-2.992-17.488-5.007-26.011c4.727-35.919,12.237-73.678,21.54-109.563c27.571,1.455,87.021,0.931,145.203-23.496
	C417.57,182.871,417.861,214.738,416.557,246.349z"/>
<path style="fill:#79C4F7;" d="M250.921,425.247c-0.722,3.272-1.479,6.52-2.305,9.757c-31.937,0.885-63.747,7.556-93.728,20.003
	c-0.605-1.106-1.199-2.224-1.781-3.342c-8.5-16.149-15.625-33.172-21.249-50.939c-6.124-19.328-10.432-39.552-12.726-60.475
	l-0.047-0.489c-1.164-10.805-1.758-21.528-1.816-32.159c-0.33-56.494,14.634-110.198,41.323-156.715
	c3.914-6.822,13.348-7.963,18.631-2.137c15.1,16.652,28.464,34.982,39.759,54.727c2.562,4.459,5.007,9,7.335,13.611
	c10.956,21.575,19.514,44.675,25.266,68.986c2.992,12.645,5.239,25.615,6.672,38.877c0.745,6.893,1.257,13.751,1.549,20.574
	C258.954,372.841,256.533,399.574,250.921,425.247z"/>
<path style="fill:#B8E6FF;" d="M257.802,345.526c0,0-65.272-20.527-125.945,55.2c-6.124-19.328-10.432-39.552-12.726-60.475
	l-0.047-0.489c-1.164-10.805-1.758-21.528-1.816-32.159c1.001-0.07,62.606-4.762,107.048-90.514
	c10.956,21.575,19.514,44.675,25.266,68.986c2.992,12.645,5.239,25.615,6.672,38.877
	C256.998,331.846,257.511,338.703,257.802,345.526z"/>
<path style="fill:#6EBBE5;" d="M172.271,189.79c2.893,9.161,5.156,18.389,7.278,27.634c2.093,9.247,3.917,18.523,5.591,27.816
	c3.295,18.591,5.91,37.255,7.942,55.981c2.036,18.726,3.464,37.519,4.214,56.383c0.35,9.436,0.548,18.886,0.473,28.369
	c-0.105,9.485-0.35,18.984-1.234,28.553c-2.906-9.16-5.172-18.388-7.3-27.632c-2.097-9.247-3.921-18.523-5.592-27.816
	c-3.294-18.591-5.91-37.254-7.919-55.984c-2.012-18.729-3.442-37.52-4.189-56.386c-0.348-9.436-0.546-18.888-0.475-28.368
	C171.159,208.857,171.399,199.357,172.271,189.79z"/>
<path style="fill:#F2D546;" d="M442.145,512C339.34,409.195,172.661,409.195,69.855,512"/>
<g>
	<path style="fill:#D6BA30;" d="M69.855,512h67.531c42.796-42.796,96.662-67.759,152.379-74.925
		C211.636,427.027,129.864,451.991,69.855,512z"/>
	<path style="fill:#D6BA30;" d="M164.337,504.197c-3.48,0-6.419-2.924-6.415-6.404c0.004-3.744,3.357-6.772,7.079-6.363
		c3.417,0.375,6,3.456,5.703,6.9C170.422,501.586,167.617,504.197,164.337,504.197z"/>
</g>
<g>
	<path style="fill:#F2D546;" d="M116.203,504.965c-3.216,0-5.995-2.494-6.362-5.684c-0.387-3.365,2.031-6.486,5.348-7.03
		c3.507-0.574,6.896,1.947,7.36,5.475C123.045,501.504,120.016,504.965,116.203,504.965z"/>
	<path style="fill:#F2D546;" d="M138.523,487.116c-3.8,0-6.854-3.47-6.35-7.242c0.489-3.662,4.101-6.192,7.703-5.409
		c3.105,0.675,5.299,3.612,5.025,6.788C144.619,484.52,141.808,487.116,138.523,487.116z"/>
</g>
<g>
	<path style="fill:#D6BA30;" d="M343.63,490.225c-3.475,0-6.401-2.931-6.404-6.404c-0.002-3.495,2.926-6.4,6.41-6.41
		c3.494-0.009,6.399,2.929,6.398,6.41C350.032,487.302,347.119,490.225,343.63,490.225z"/>
	<path style="fill:#D6BA30;" d="M387.874,505.745c-3.347,0-6.201-2.704-6.393-6.043c-0.208-3.613,2.775-6.768,6.399-6.768
		c3.629,0,6.592,3.156,6.387,6.768C394.077,503.047,391.226,505.745,387.874,505.745z"/>
</g>
<path style="fill:#F2D546;" d="M182.966,474.693c-3.317,0-6.199-2.655-6.392-5.985c-0.197-3.402,2.329-6.407,5.716-6.776
	c3.544-0.385,6.844,2.362,7.056,5.938C189.561,471.509,186.636,474.693,182.966,474.693z"/>
    </svg>
  `,
  iconSize: [24, 48],
  iconAnchor: [12, 48],
  popupAnchor: [0, -48]
});

const FlyToLocation: React.FC<{ center: [number, number]; isVisible: boolean }> = ({ center, isVisible }) => {
  const map = useMap();

  useEffect(() => {
    if (!isVisible) return; // Don't start the animation if the map isn't visible

    const flyToSequence = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (map) {
        map.flyTo([center[0], center[1]], 5, {
          duration: 10
        });
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (map) {
        map.flyTo(center, 13, {
          duration: 10
        });
      }
    };

    flyToSequence();
  }, [map, center, isVisible]);

  return null;
};





const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);

  useEffect(() => {
    if (mapRef.current) {
      const mapElement = mapRef.current; // Capture the current value
  
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Update state when map visibility changes
          setIsMapVisible(entry.isIntersecting);
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.5, // Trigger when 50% of the map is visible
        }
      );
  
      observer.observe(mapElement);
  
      // Cleanup function
      return () => {
        observer.unobserve(mapElement);
      };
    }
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Our Location</h2>
        <div ref={mapRef} style={{ height: '600px', width: '100%' }}>
          <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%', width: '100%', zIndex: 9 }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={center} icon={customIcon}/>
            <FlyToLocation center={center} isVisible={isMapVisible} />
          </MapContainer>
        </div>
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Luxury Resort Kuta Lombok</h3>
          <p className="text-gray-600">123 Beach Road, Kuta, Lombok, Indonesia</p>
          <p className="text-gray-600">Phone: +62 123 456 7890</p>
          <p className="text-gray-600">Email: info@luxuryresortkutalombok.com</p>
        </div>
      </div>
    </section>
  );
};

export default Map;