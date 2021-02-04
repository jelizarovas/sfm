import React, { useState } from "react";
import CountButton from "./CountButton";
import { useInventory } from "./Providers/InventoryProvider";

export const Material = ({ m }) => {
  const { id, name, volume, count, img, w, d, h, description, subtext } = m;
  const { dispatch } = useInventory();

  const [tooltip, setTooltip] = useState(false);

  const onClick = () => {
    setTooltip((t) => !t);
  };

  const SvgInfo = () => {
    return (
      <svg
        className="fill-current w-4 h-4 inline text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        onClick={onClick}
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  const changeCount = (newCount) => {
    dispatch({ type: "changeCount", payload: { id, newCount } });
  };

  return (
    <tr>
      <td>
        <div className="flex align-middle w-60">
          <div className="p-1">
            <img
              className="max-h-4 w-4"
              src={process.env.PUBLIC_URL + "/" + img}
              alt=""
            />
          </div>
          <div className="flex">
            <div className="flex-1">
              {name}{" "}
              {/* <div className={tooltip ? "" : "hidden"}>
                <div>
                {w && d && h ? `W: ${w}", D: ${d}", H: ${h}" ` : description}
                </div>{" "}
              </div> */}
              {/*  */}
            </div>
            <div className="text-xs align-middle">
              <span>{volume ? `${volume} c.u. ft.` : subtext} </span>
            </div>
          </div>
        </div>
      </td>

      <td>
        <CountButton count={count} changeCount={changeCount} />
      </td>
    </tr>
  );
};