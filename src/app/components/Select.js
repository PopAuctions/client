const Select = ({ deviceType, devices, updateDevice }) => {
    return (
        <div className="column">
            <label>{`Select ${deviceType}:`}</label>
            <select onChange={(e) => updateDevice(e.target.value)}>
                device
                {devices?.map((device) => {
                    return (
                        <option
                            key={`${deviceType.charAt(0).toLowerCase() +
                                deviceType.slice(1)}-${device.deviceId}`}
                            value={device.deviceId}
                        >
                            {device.label}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default Select;