const CheckBox = ({ name, value, onChange }) => {
  return (
    <li>
      <input type="checkbox" name={name} value={value} onChange={onChange} />
      <span>{value}</span>
    </li>
  );
};

export default CheckBox;
