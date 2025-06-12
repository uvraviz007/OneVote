import React, { useState, useEffect } from 'react';

export default function Count() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const [voteCounts, setVoteCounts] = useState([
    { name: 'Party A', votes: 0 },
    { name: 'Party B', votes: 0 },
    { name: 'Party C', votes: 0 }
  ]);

  // Update current time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

 

  return (
    <div className="container mt-5 text-black">
      <h2 className="text-center mb-4">Live Vote Counts</h2>

      <p className="text-center mb-4">
         <strong>{currentTime.toLocaleString()}</strong>
      </p>

      <div className="list-group">
        {voteCounts.map((party, index) => (
          <div
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <strong>{party.name}</strong>
            <span className="badge bg-success rounded-pill">{party.votes}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
