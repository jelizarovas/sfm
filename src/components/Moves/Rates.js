import React, { useEffect } from "react";
import { AccessTime, LocalShipping, CreditCard, LocalOfferTwoTone } from "@material-ui/icons/";
import { SectionTitle } from "../Layout/SectionTitle";

import { useMove, useMoveDispatch } from "../Providers/MoveProvider";

// import { ChipsInput } from "../Inputs/ChipsInput";
// import { ButtonSelect } from "../Inputs/ButtonSelect";
import { NoInput } from "../Inputs/NoInput";
import { Local } from "./Local";
import { LongDistance } from "./LongDistance";
import { FlatRate } from "./FlatRate";
import { Radio } from "../Inputs/Radio";
// import { TimeInput } from "../Inputs/TimeInput";

export const Rates = () => {
  const client = useMove();
  const dispatch = useMoveDispatch();

  const onChange = (e) => dispatch({ field: e.target.name, value: e.target.value });

  const { totalTransportation, jobType } = client;

  useEffect(() => {
    if (!jobType)
      dispatch({
        field: "jobType",
        value: "local",
      });
    return () => {};
  }, [jobType, dispatch]);

  return (
    <form method="post">
      <SectionTitle title="Job Type" hidePlus={true} />
      <JobType onClick={onChange} value={jobType} />

      {/* <SectionTitle title="Crew" hidePlus={true} /> */}
      {/* <ChipsInput name="personnel" chips={personnel} /> */}
      {/* <DropDown /> */}

      {jobType === "flatRate" && <FlatRate />}
      {jobType === "longDistance" && <LongDistance />}
      {jobType === "local" && <Local />}
      <NoInput value={totalTransportation} Icon={LocalOfferTwoTone} unit="$" label="Total Transportation" />
    </form>
  );
};

// function timeToDecimal(t) {
//   var arr = t.split(":");
//   var dec = parseInt((arr[1] / 6) * 10, 10);

//   return parseFloat(parseInt(arr[0], 10) + "." + (dec < 10 ? "0" : "") + dec);
// }

const JobType = (props) => {
  const client = useMove();
  const dispatch = useMoveDispatch();

  const { jobType } = client;

  const jobTypes = [
    { value: "local", name: "Local (Hourly)", Icon: AccessTime },
    { value: "flatRate", name: "Flat Rate", Icon: CreditCard },
    { value: "longDistance", name: "Long Distance", Icon: LocalShipping },
  ];

  return (
    <Radio name="jobType" value={jobType} dispatch={dispatch} options={jobTypes} row="true" dense="true" {...props} />
  );
};
