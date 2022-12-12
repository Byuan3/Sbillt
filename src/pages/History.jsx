import React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, ContextMenu, Filter, Page, Inject } from '@syncfusion/ej2-react-grids';

import { contextMenuItems, activitiesGrid } from '../data/dummy';
import { Header } from '../components';
import { useStateContext } from "../contexts/ContextProvider";

const History = () => {

  const {
    acts
  } = useStateContext();

  console.log(acts)

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="History" />
      <GridComponent
        id="gridcomp"
        dataSource={acts}
        allowPaging
        contextMenuItems={contextMenuItems}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {activitiesGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Resize, ContextMenu, Filter, Page ]} />
      </GridComponent>
    </div>
  );
};
export default History;
