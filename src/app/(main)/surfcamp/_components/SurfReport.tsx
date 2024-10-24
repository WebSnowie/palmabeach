import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SurfCondition {
  waveHeight: number;
  wavePeriod: number;
  waveDirection: number;
  windSpeed: number;
  windDirection: number;
  temperature: number;
}

const SurfReport: React.FC = () => {
  const [surfConditions, setSurfConditions] = useState<SurfCondition | null>(null);

  useEffect(() => {
    const fetchSurfConditions = async () => {
      const lat = -8.88968526; // Example latitude (San Clemente, CA)
      const lng = 116.15441495; // Example longitude (San Clemente, CA)
      const params = 'waveHeight,wavePeriod,waveDirection,windSpeed,windDirection,waterTemperature';
      const source = 'noaa'; // You can change this to other sources if needed

      try {
        const response = await fetch(
          `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&source=${source}`,
          {
            headers: {
              'Authorization': '9e8bbe3a-921d-11ef-8770-0242ac130003-9e8bbec6-921d-11ef-8770-0242ac' // Replace with your Stormglass API key
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch surf conditions');
        }

        const data = await response.json();
        const currentData = data.hours[0];

        setSurfConditions({
          waveHeight: currentData.waveHeight[source],
          wavePeriod: currentData.wavePeriod[source],
          waveDirection: currentData.waveDirection[source],
          windSpeed: currentData.windSpeed[source],
          windDirection: currentData.windDirection[source],
          temperature: currentData.waterTemperature[source],
        });
      } catch (error) {
        console.error('Error fetching surf conditions:', error);
      }
    };

    fetchSurfConditions();
  }, []);

  if (!surfConditions) {
    return <div className="text-center text-gray-600">Loading surf conditions...</div>;
  }

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-semibold mb-4 text-center">Current Surf Conditions</h3>
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="text-center">
          <h4 className="text-lg font-medium text-gray-600">Wave Height</h4>
          <p className="text-2xl font-bold text-blue-600">{surfConditions.waveHeight.toFixed(1)} m</p>
        </div>
        <div className="text-center">
          <h4 className="text-lg font-medium text-gray-600">Wave Period</h4>
          <p className="text-2xl font-bold text-blue-600">{surfConditions.wavePeriod.toFixed(1)} s</p>
        </div>
        <div className="text-center">
          <h4 className="text-lg font-medium text-gray-600">Wave Direction</h4>
          <p className="text-2xl font-bold text-blue-600">{surfConditions.waveDirection.toFixed(0)}°</p>
        </div>
        <div className="text-center">
          <h4 className="text-lg font-medium text-gray-600">Wind Speed</h4>
          <p className="text-2xl font-bold text-blue-600">{surfConditions.windSpeed.toFixed(1)} m/s</p>
        </div>
        <div className="text-center">
          <h4 className="text-lg font-medium text-gray-600">Wind Direction</h4>
          <p className="text-2xl font-bold text-blue-600">{surfConditions.windDirection.toFixed(0)}°</p>
        </div>
        <div className="text-center">
          <h4 className="text-lg font-medium text-gray-600">Water Temperature</h4>
          <p className="text-2xl font-bold text-blue-600">{surfConditions.temperature.toFixed(1)}°C</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SurfReport;
