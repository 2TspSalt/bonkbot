import { css } from "hono/css";
import type { FC } from "hono/jsx";

const bonkStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  margin: 10px;
  background-color: #FEBDBB;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  h3 {
    font-size: xx-large;
  }
`;

export const BonkCell: FC<{ name: string; count: number }> = ({ name, count }) => (
  <div id={`${name}/${count}`} className={bonkStyle}>
    <h2>{name}</h2>
    <h3>{count}</h3>
  </div>
);
