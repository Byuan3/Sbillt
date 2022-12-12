import React from "react";
import { AiFillBank } from "react-icons/ai";
import { BsFillWalletFill } from "react-icons/bs";
import { FcProcess } from "react-icons/fc";
import {
  HiLightningBolt,
  HiCurrencyDollar,
  HiArrowCircleRight,
  HiArrowCircleLeft,
} from "react-icons/hi";

export const links = [
  {
    title: "Dashboard",
    links: [
      {
        name: "balance",
        icon: <BsFillWalletFill />,
      },
    ],
  },
  {
    title: "Features",
    links: [
      {
        name: "splitbill",
        icon: <HiLightningBolt />,
      },
      {
        name: "request",
        icon: <HiArrowCircleLeft />,
      },
      {
        name: "pay",
        icon: <HiArrowCircleRight />,
      },
      {
        name: "add",
        icon: <HiCurrencyDollar />,
      },
    ],
  },
  {
    title: "Pages",
    links: [
      {
        name: "unaccomplished",
        icon: <FcProcess />,
      },
      {
        name: "history",
        icon: <AiFillBank />,
      },
    ],
  },
];

export const themeColors = [
  {
    name: "blue-theme",
    color: "#1A97F5",
  },
  {
    name: "orange-theme",
    color: "#FFA600",
  },
  {
    name: "purple-theme",
    color: "#7352FF",
  },
  {
    name: "red-theme",
    color: "#FF5C8E",
  },
  {
    name: "indigo-theme",
    color: "#1E4DB7",
  },
  {
    color: "#FB9678",
    name: "orange-theme",
  },
];

export const activitiesGrid = [
  {
    field: "Format",
    headerText: "Format",
    format: "C2",
    textAlign: "Left",
    editType: "numericedit",
    width: "150",
  },
  {
    field: "TotalAmount",
    headerText: "Total Amount",
    format: "C2",
    textAlign: "Center",
    editType: "numericedit",
    width: "150",
  },
  {
    field: "BillInformation",
    headerText: "Information",
    width: "150",
    textAlign: "Right",
  },
];

export const un_activitiesGrid = [
  {
    field: "Requester",
    headerText: "Request from",
    width: "120",
    textAlign: "Left",
  },
  {
    field: "Format",
    headerText: "Format",
    format: "C2",
    textAlign: "Center",
    editType: "numericedit",
    width: "150",
  },
  {
    field: "TotalAmount",
    headerText: "Total Amount",
    format: "C2",
    textAlign: "Center",
    editType: "numericedit",
    width: "150",
  },
  {
    field: "BillInformation",
    headerText: "Information",
    width: "150",
    textAlign: "Right",
  },
];

export const contextMenuItems = [
  'AutoFit',
  'AutoFitAll',
  'SortAscending',
  'SortDescending',
  'Copy',
  'Edit',
  'Delete',
  'Save',
  'Cancel',
  'PdfExport',
  'ExcelExport',
  'CsvExport',
  'FirstPage',
  'PrevPage',
  'LastPage',
  'NextPage',
];