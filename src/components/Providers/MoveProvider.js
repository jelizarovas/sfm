import React, { useContext, useReducer, createContext, useEffect } from "react";
import { defaultMove } from "../../utils/defaultMove";
import { money_round, convertToHHMM, timeToDecimal } from "../../utils/helperFunctions";
// import { useKeyPress } from "../../utils/useKeyPress";
// const small = useKeyPress("q");
// console.log(small);
// const medium = useKeyPress("w");
// const large = useKeyPress("e");
// const mattressbag = useKeyPress("r");
// const wardrobeRent = useKeyPress("t");
// const wardrobeBuy = useKeyPress("y");
// const num1 = useKeyPress("1");
// const num2 = useKeyPress("2");q
// const num3 = useKeyPress("3");
// const num4 = useKeyPress("4");
// const num5 = useKeyPress("5");

// useEffect(() => {
//   if (small) {
//     dispatch({ type: "keyAdd", payload: "q3lYEM" });
//   }
//   return () => {};
// }, [small]);

const MoveContext = createContext();
const MoveDispatchContext = createContext();

const useMove = () => {
  const context = useContext(MoveContext);
  if (context === undefined) {
    throw new Error("useMove must be used within a MoveProvider");
  }
  return context;
};
const useMoveDispatch = () => {
  const context = useContext(MoveDispatchContext);
  if (context === undefined) {
    throw new Error("useMoveDispatch must be used within a MoveDispatchProvider");
  }
  return context;
};

const moveReducer = (state, { field, value, type, groupName, payload, id = null }) => {
  if (!type) {
    return {
      ...state,
      [field]: value,
    };
  } else {
    const group = state[groupName];
    switch (type) {
      case "groupUpdate": {
        return {
          ...state,
          [groupName]: group?.find((g) => g.id === id)
            ? group.map((g) => (id === g.id ? { ...g, ...payload } : g))
            : [...group, { id, ...payload }],
        };
      }
      case "groupClear": {
        return {
          ...state,
          [groupName]: [],
        };
      }
      case "groupRemove": {
        return {
          ...state,
          [groupName]: group.filter((g) => g.id !== id),
        };
      }
      default:
        return state;
    }
  }
};

// const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// const getDataFromAPI = async () => {
//   await delay(2000);
//   return {
//     my: "data"
//   };
// };

const getInitialState = () => {
  if ("move" in localStorage) {
    try {
      return JSON.parse(localStorage.getItem("move"));
    } catch (err) {
      return {};
    }
  } else {
    return defaultMove;
  }
};

const withLocalStorageCache = (reducer) => {
  return (state, action) => {
    const newState = reducer(state, action);
    localStorage.setItem("move", JSON.stringify(newState));
    return newState;
  };
};

const MoveProvider = ({ children }) => {
  const [state, dispatch] = useReducer(withLocalStorageCache(moveReducer), getInitialState());

  const {
    valuation,
    valuationCost,
    valuationCostWithDeductible,
    shipmentValue,
    valuationRate,
    valuationRateWithDeductible,
    estimatedWeight,
    hourlyRate,
    travelTime,
    totalHours,
    startTime,
    endTime,
    arriveTime,
    departTime,
    breakTime,
    subtotal,
    materials,
    miscFees,
    isTravelFeeFixed,
    travelFee,
    // adjustment,
    netWeight,
    mileageRate,
    totalMovingCharges,
    totalAmountPaid,
    flatIsMaterialsIncluded,
    // remainingBalance,
    paymentOption,
    totalTransportation,
    jobType,
    flatAmount,
    totalMaterials,
    totalOtherFees,
  } = state;

  /*########## TOTAL MATERIALS ##########*/
  useEffect(() => {
    dispatch({
      field: "totalMaterials",
      value:
        jobType === "flatRate" && flatIsMaterialsIncluded === true
          ? 0
          : materials.reduce((sum, { units = 0, rate = 0 }) => sum + Number(units) * Number(rate), 0),
    });
  }, [materials, jobType, flatIsMaterialsIncluded, dispatch]);
  /*########## TOTAL MISC FEES ##########*/
  useEffect(() => {
    dispatch({
      field: "totalMiscFees",
      value: miscFees.reduce((sum, { value = 0, selected = false }) => sum + (selected ? Number(value) : 0), 0),
    });
  }, [miscFees, flatIsMaterialsIncluded, dispatch]);

  /*########## TOTAL VALUATION ##########*/
  useEffect(() => {
    dispatch({
      field: "totalValuation",
      value: valuation === "basic" ? 0 : valuation === "replacement" ? valuationCost : valuationCostWithDeductible,
    });
  }, [valuation, valuationCost, valuationCostWithDeductible, dispatch]);

  /*########## VALUATION COSTS ##########*/
  useEffect(() => {
    // if (shipmentValue < estimatedWeight * 5) {
    //   dispatch({
    //     field: "shipmentValue",
    //     value: estimatedWeight * 5,
    //   });
    // }
    dispatch({
      field: "valuationCost",
      value: Math.ceil((shipmentValue / 100) * valuationRate * 100) / 100,
    });
    dispatch({
      field: "valuationCostWithDeductible",
      value: Math.ceil((shipmentValue / 100) * valuationRateWithDeductible * 100) / 100,
    });
  }, [shipmentValue, valuationRate, valuationRateWithDeductible, dispatch]);

  /*########## SHIPMENT VALUE ##########*/
  useEffect(() => {
    // if (shipmentValue < estimatedWeight * 5) {
    dispatch({
      field: "shipmentValue",
      value: estimatedWeight * 5,
    });
    // }
  }, [estimatedWeight, dispatch]);

  /*########## TOTAL HOURS ##########*/
  useEffect(() => {
    const begin = timeToDecimal(isTravelFeeFixed ? arriveTime : startTime);
    let finish = timeToDecimal(isTravelFeeFixed ? departTime : endTime);
    const breaks = timeToDecimal(breakTime);

    if (begin > finish) finish += 12;

    dispatch({
      field: "totalHours",
      value: convertToHHMM(finish - begin - breaks),
    });
  }, [totalHours, startTime, endTime, arriveTime, departTime, breakTime, isTravelFeeFixed, dispatch]);

  /*########## TRAVEL FEE ##########*/
  useEffect(() => {
    dispatch({
      field: "travelFee",
      value: (Number(hourlyRate) * Number(travelTime)).toString(),
    });
  }, [travelTime, hourlyRate, dispatch]);

  /*########## TOTAL TRANSPORTATION ##########*/
  useEffect(() => {
    let value;
    const field = "totalTransportation";

    switch (jobType) {
      case "flatRate":
        value = Number(flatAmount).toString();
        break;
      case "local":
        let tFee = isTravelFeeFixed ? Number(travelFee) : 0;
        value = Number(timeToDecimal(totalHours)) * Number(hourlyRate) + tFee;
        break;
      case "longDistance":
        value = Number(netWeight) * Number(mileageRate).toString();
        break;
      default:
        break;
    }
    dispatch({ field, value });
  }, [jobType, flatAmount, totalHours, hourlyRate, netWeight, mileageRate, travelFee, isTravelFeeFixed, dispatch]);

  /*########## SUBTOTAL ##########*/
  useEffect(() => {
    dispatch({
      field: "subtotal",
      value: (
        Number(totalTransportation) +
        Number(totalOtherFees) +
        Number(totalMaterials) +
        Number(valuationCost)
      ).toString(),
    });

    return () => {};
  }, [
    totalTransportation,
    totalOtherFees,
    totalMaterials,
    valuationCost,
    // adjustment,
    // totalMovingCharges,
    // totalAmountPaid,
    // remainingBalance,
  ]);

  //TODO totalOtherFees

  /*########## ADJUSTMENT & TOTAL MOVINGCHARGES ##########*/
  useEffect(() => {
    let adjustment = 0;

    switch (paymentOption) {
      case "cash":
        adjustment = -5 / 100;
        break;
      case "card":
        adjustment = 3 / 100;
        break;

      default:
        break;
    }

    const adjustmentNumber = Number(subtotal) * adjustment;
    const totalMovingChargesNumber = Number(subtotal) * (1 + Number(adjustment));
    dispatch({
      field: "adjustment",
      value: money_round(adjustmentNumber).toString(),
    });
    dispatch({
      field: "totalMovingCharges",
      value: money_round(totalMovingChargesNumber).toString(),
    });
    return () => {};
  }, [paymentOption, subtotal]);

  /*########## REMAINING BALANCE ##########*/
  useEffect(() => {
    const remainingBalanceNumber = Number(totalMovingCharges) - Number(totalAmountPaid);

    dispatch({
      field: "remainingBalance",
      value: money_round(remainingBalanceNumber).toString(),
    });
  }, [totalAmountPaid, totalMovingCharges]);
  //TODO totalAmountPaid

  //TODO remianing balance

  return (
    <MoveContext.Provider value={state}>
      <MoveDispatchContext.Provider value={dispatch}>{children}</MoveDispatchContext.Provider>
    </MoveContext.Provider>
  );
};

export { MoveProvider, useMove, useMoveDispatch };
