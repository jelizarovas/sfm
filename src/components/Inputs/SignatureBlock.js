import React, { useRef } from "react";
// import SignatureCanvas from "react-signature-canvas";
import SignaturePad from "react-signature-pad-wrapper";

export const SignatureBlock = ({ type = "Initial", name, width = 500, height = 200, dispatch = () => {} }) => {
  // const [imageURL, setImageURL] = useState(null);

  const sigCanvas = useRef({});

  const clear = () => {
    sigCanvas.current.clear();
    dispatch({ payload: { [name]: "" } });
  };

  const save = () => {
    const url = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    // setImageURL(url);
    dispatch({ payload: { [name]: url } });
  };

  return (
    <div className="flex flex-col">
      {/* <h2>{name}</h2> */}
      <div className=" w-full relative">
        <div className="rounded-lg p-1 bg-gray-400 bg-opacity-50 relative ">
          <SignaturePad
            penColor="black"
            canvasProps={{
              width,
              height,
              className: "bg-white rounded-lg",
            }}
            onEnd={save}
            ref={sigCanvas}
          />
          <div className="w-4/5 mx-auto border-t-2 absolute bottom-6 left-0 right-0 text-center text-gray-400 select-none">
            {type}
          </div>
        </div>
        <button
          className="bg-gray-400 bg-opacity-50 no select-none hover:bg-opacity-100 text-xs p-2 m-2 text-white absolute top-0 right-0 rounded-lg"
          onClick={clear}
        >
          Reset
        </button>
        {/* {imageURL ? (
          <img
            src={imageURL}
            alt="my signature"
            style={{
              display: "block",
              margin: "0 auto",
              border: "1px solid black",
              width: "500px",
            }}
          />
        ) : null} */}
      </div>
    </div>
  );
};
