import { css, Style } from "hono/css";
import type { FC } from "hono/jsx";
import { BonkCell } from "./BonkCell.tsx";

const pageStyle = css`
  display: flex;
  justify-content: center;
`;

export const Root: FC<{ bonkState: Record<string, number>}> = ({ bonkState }) => {
  return (
    <html>
      <head>
        <Style />
      </head>
      <body>
        <div className={pageStyle}>
          {Object.entries(bonkState).map(([name, count]) => (
            <BonkCell name={name} count={count} />
          ))}
        </div>
      </body>
    </html>
  );
};
