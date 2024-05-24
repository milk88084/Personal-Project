import styled from "styled-components";

const ButtonStyle = styled.button`
  padding: 8px 24px;
  border-radius: 12px;
  font-weight: 300;
  font-size: 15px;
  background-color: #19242b;
  color: white;
  margin: 20px 0px;
  margin-right: 20px;
  font-size: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #9ca3af;
    color: #19242b;
  }

  &:active {
    box-shadow: 2px 2px 5px #666666;
    transform: scale(0.9);
  }
`;

export default function Buttons({
  text,
  onClick,
  icon,
  type,
  title,
  onChange,
}) {
  return (
    <div>
      <ButtonStyle
        title={title}
        type={type}
        onClick={onClick}
        onChange={{ onChange }}
      >
        {icon}
        {text}
      </ButtonStyle>
    </div>
  );
}
