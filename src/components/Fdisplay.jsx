import React from "react";
import {
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-grids";
import { un_activitiesGrid } from "../data/dummy";

const Fdisplay = () => {
  return (
    <div>
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {un_activitiesGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
    </div>
  );
};

export default Fdisplay;
