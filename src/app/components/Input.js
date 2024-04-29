const Input = ({ label, value, onChange }) => {
    return (
        <div className="column">
            <label>{`${label}:`}</label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                type="text"
            ></input>
        </div>
    );
};

export default Input;