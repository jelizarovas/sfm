import React from "react";
import { Route, Switch } from "react-router-dom";
import { MaterialsWProvider } from "../Moves/Materials";
import { BillOfLading } from "./BillOfLading";
import { MaterialsProvider, useMaterialsDispatch, useMaterials } from "../Providers/MaterialsProvider";
import { MakeText } from "./MakeText";
import { ABHS } from "./ABHS";
import { TipSplit } from "./TipSplit";

export const ToosWProviders = () => {
  const materials = useMaterials();
  const materialsDispatch = useMaterialsDispatch();

  return (
    <div className="flex flex-col items-stretch w-full sm:w-3/4 mx-auto lg:w-1/2 pb-10">
      <Switch>
        <Route path={`/t/materials`}>
          <MaterialsWProvider state={materials} dispatch={materialsDispatch} />
        </Route>
        <Route path={`/t/coordinates`}>
          <BillOfLading />
        </Route>
        <Route path={`/t/sms`}>
          <MakeText />
        </Route>
        <Route path={`/t/abhs`}>
          <ABHS />
        </Route>
        <Route path={`/t/tips`}>
          <TipSplit />
        </Route>
      </Switch>
    </div>
  );
};

export const Tool = () => {
  return (
    <MaterialsProvider>
      <ToosWProviders />
    </MaterialsProvider>
  );
};
