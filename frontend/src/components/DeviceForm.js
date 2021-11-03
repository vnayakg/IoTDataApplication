import { useParams } from 'react-router-dom';

const DeviceForm = () => {
  const { deviceType } = useParams();

  return (
    <div>
      <h1>Device Form</h1>
      <h2>deviceType: {deviceType}</h2>
    </div>
  );
};

export default DeviceForm;
