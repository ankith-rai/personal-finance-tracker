import React, { useState, useEffect } from 'react';

interface StockDashboardProps {
  symbol?: string;
}

const StockDashboard: React.FC<StockDashboardProps> = () => {
  const [stockData, setStockData] = useState([]);
  const [prediction, setPredictions] = useState([]);

  useEffect(() => {
    fetch('/api/stocks')
    .then(response => response.json())
    .then(data => setStockData(data));

    fetch('/api/predictions')
    .then(response => response.json())
    .then(data => setPredictions(data));
  }, [])

  return (
    <div>
      <h1>
        Stock Market Predictor
      </h1>
      <canvas/>
    </div>
  )
};

export default StockDashboard;
