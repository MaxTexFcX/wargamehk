import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Selecttimer = () => {

  var socket = io('http://localhost:5000');
  const [data1, setData1] = useState("123")
  const [ports, setPorts] = useState([])
  const [selectedPort, setSelectedPort] = useState('')

  socket.on('data', function (data) {
    console.log(data);
    setData1(data)
  });

  useEffect(() => {
    async function fetchAvailablePorts() {
      const response = await fetch('/arduino/timer/ports');
      const portsData = await response.json();
      setPorts(portsData);
    }

    fetchAvailablePorts();
  }, []);

  const handlePortChange = async (event) => {
    const port = event.target.value;
    setSelectedPort(port);

    if (port) {
      try {
        const response = await fetch(`/arduino/connect/${encodeURIComponent(port)}`);
        const data = await response.json();
        console.log(data.message);
      } catch (error) {
        console.error('Error connecting to the port:', error);
      }
    }
  };

  return (
    <div>
      <p> Select a serial port </p>
      <select value={selectedPort} onChange={handlePortChange}>
        <option value=""> Choose  a port </option>
        {ports.map((port) => (
          <option key={port} value={port}>
            {port}
          </option>
        ))}
      </select>
      {data1}
    </div>
  );
};

export default Selecttimer
