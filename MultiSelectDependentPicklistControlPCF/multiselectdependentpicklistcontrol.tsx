//React
import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';

//Redux
import { useSelector, useDispatch, Provider } from 'react-redux';
import { createStore, AnyAction, combineReducers } from "redux";
import { configureStore } from '@reduxjs/toolkit'

//Other
import structuredClone from '@ungap/structured-clone';
import { rejects } from 'assert';

//FluentUI
import {
    ComboBox,
    IComboBox,
    IComboBoxOption,
    IComboBoxStyles,
    SelectableOptionMenuItemType,
    PrimaryButton,
    IButtonStyles,
  } from '@fluentui/react';

  import {
    DetailsList,
    buildColumns,
    IColumn,
    mergeStyleSets,
    HoverCard,
    IExpandingCardProps,
    Selection,
    ThemeProvider,
  } from '@fluentui/react';
  import { createListItems, IExampleItem } from '@fluentui/example-data';


//-------------------------
//Testing/System/DataSource
//-------------------------
var DATA_SOURCE = "CRM"
let href = window!.top!.location.href;
if(href.indexOf("127.") > -1 || href.indexOf("localhost") > -1) {
    DATA_SOURCE="TEST";
}
var CRM_TEST_MODE = 0;


//UI Stuff
/*
const options: IComboBoxOption[] = [
    { key: 'Header1', text: 'First heading', itemType: SelectableOptionMenuItemType.Header },
    { key: 'A', text: 'Option A' },
    { key: 'B', text: 'Option B' },
    { key: 'C', text: 'Option C' },
    { key: 'D', text: 'Option D' },
    { key: 'divider', text: '-', itemType: SelectableOptionMenuItemType.Divider },
    { key: 'Header2', text: 'Second heading', itemType: SelectableOptionMenuItemType.Header },
    { key: 'E', text: 'Option E' },
    { key: 'F', text: 'Option F', disabled: true },
    { key: 'G', text: 'Option G' },
    { key: 'H', text: 'Option H' },
    { key: 'I', text: 'Option I' },
    { key: 'J', text: 'Option J' },
  ];
  // Optional styling to make the example look nicer
  const comboBoxStyles: Partial<IComboBoxStyles> = { root: { maxWidth: 300 } };
  const buttonStyles: Partial<IButtonStyles> = { root: { display: 'block', margin: '10px 0 20px' } };
*/




//-------------------------
//Redux
//-------------------------
interface IStoreData {
  dataOriginal: Array<any>,
  dataFiltered: Array<any>
}

const initialStoreData:IStoreData = {
  dataOriginal: [],
  dataFiltered: []
}

function reducerCustomData(data:IStoreData = initialStoreData, action:AnyAction) {
  switch (action.type) {
      case "CUSTOMDATA/SETDATA_FILTERED":
          return {
            ...data,
            dataFiltered: action.data1
          }
      case "CUSTOMDATA/SETDATA_ORIGINAL":
        return {
          ...data,
          dataOriginal: action.data1
        }          
      default:
      return data;
  }
}

//const reduxStore = createStore(reducerCustomData as any);
const reduxStore = configureStore({ reducer: reducerCustomData });

//Save data to store
//dispatch({ type: "CUSTOMDATA/SETDATA_FILTERED", data1: data });
//dispatch({ type: "CUSTOMDATA/SETDATA_ORIGINAL", data1: data });

//Get data from store
//let data = useSelector((data: IStoreData) => data);
//let cdata1 = data.dataOriginal;
//let cdata1 = data.dataFiltered;

function MultiSelectDependentPicklistControl(props:any) {

    //-------------------------
    //UI Stuff
    //-------------------------
    //const comboBoxRef = React.useRef<IComboBox>(null);
    //const onOpenClick = React.useCallback(() => comboBoxRef.current?.focus(true), []);

    const classNames = mergeStyleSets({
        compactCard: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        },
        expandedCard: {
          padding: '16px 24px',
        },
        item: {
          selectors: {
            '&:hover': {
              textDecoration: 'underline',
              cursor: 'pointer',
            },
          },
        },
      });
      
      interface IPicklistItem {
        label:string;
        value:string;
      }

    //-------------------------
    //State
    //-------------------------
    const [picklist2items, setPicklist2items] = React.useState({ 
       data : [] as Array<IPicklistItem>,
    });
    const [picklist2itemsFiltered, setPicklist2itemsFiltered] = React.useState({ 
      data : [] as Array<IPicklistItem>,
   });

    //-----------------------
    //Get current record data
    //-----------------------
    let currentEntityId = (props.context.mode as any).contextInfo.entityId;
    let currentEntityTypeName = (props.context.mode as any).contextInfo.entityTypeName;
    let currentEntityRecordName = (props.context.mode as any).contextInfo.entityRecordName;

    //--------------
    //Get PCF Config
    //--------------
    interface IMapping {
      field1value:number;
      field2values:Array<number>;
    }
    interface IMappingConfig {
      field1name:string;
      field2name:string;
      mappings:Array<IMapping>;
    }
    let mapping_config:IMappingConfig;
    if(DATA_SOURCE=="TEST") {
      mapping_config = JSON.parse('{"field1name":"sup_categorycode", "field2name":"sup_subcategorycode", "mappings":[{"field1value":43534534, "field2values":[346433,43535]}]}');
    }
    else {
      mapping_config = JSON.parse(props.context.parameters?.mapping_config_property?.raw);
    }
   
    //---------------------
    //Init data / load data
    //---------------------
    const itemsPicklist1: IPicklistItem[] = [{"label":"ABT543564", "value":"43534534"},{"label":"ABT23334", "value":"434534"},{"label":"ABT33423435", "value":"4534534"},{"label":"ABT334233435", "value":"453234534"},{"label":"ABT334523435", "value":"45345324"}];
    const columnsPicklist1: IColumn[] =  [ { key: 'Category', name: 'Category', fieldName: 'label', minWidth: 100, maxWidth: 200, isResizable: true },];
    const columnsPicklist2: IColumn[] =  [ { key: 'Subcategory', name: 'Subcategory', fieldName: 'label', minWidth: 100, maxWidth: 200, isResizable: true },];
    const dispatch = useDispatch(); //Init Dispatch

    if(picklist2items.data.length==0) {
      if(DATA_SOURCE=="TEST") {
          //Init test data
          let picklistData:Array<IPicklistItem> = [{"label":"TTZ34223", "value":"346433"},{"label":"TTZ435342", "value":"43535"},{"label":"TTZ234522", "value":"34534124"},{"label":"TTZ2342522", "value":"345334124"},{"label":"TTZ2345522", "value":"345374124"}];
          setPicklist2items({"data":picklistData});
          setPicklist2itemsFiltered({"data":picklistData});
          dispatch({ type: "CUSTOMDATA/SETDATA_ORIGINAL", data1: picklistData });
          dispatch({ type: "CUSTOMDATA/SETDATA_FILTERED", data1: picklistData });
      }
      else {
          //Load data from crm
      }
    }

    let storedata = useSelector((data: IStoreData) => data);

    //---------
    //Functions
    //---------
    const onRenderCompactCard = (item: IPicklistItem): JSX.Element => {
      return (
        <div className={classNames.compactCard}>
          <a target="_blank" href={`http://wikipedia.org/wiki/${item.label}`}>
            {item.label}
          </a>
        </div>
      );
    };

    const onRenderExpandedCardPicklist1 = (item: IPicklistItem): JSX.Element => {
      return (
        <div className={classNames.expandedCard}>
          {item.label}
          <DetailsList setKey="expandedCardSet" items={itemsPicklist1} columns={columnsPicklist1} />
        </div>
      );
    };

    const onRenderExpandedCardPicklist2 = (item: IPicklistItem): JSX.Element => {
      return (
        <div className={classNames.expandedCard}>
          {item.label}
          <DetailsList setKey="expandedCardSet" items={itemsPicklist1} columns={columnsPicklist2} />
        </div>
      );
    };      
    
    const onRenderItemColumnPicklist1 = (item: IPicklistItem, index: number, column: IColumn): JSX.Element | React.ReactText => {
      const expandingCardProps: IExpandingCardProps = {
        onRenderCompactCard: onRenderCompactCard,
        onRenderExpandedCard: onRenderExpandedCardPicklist1,
        renderData: item,
      };
      if (column.key === 'Category') {
        return (
          <HoverCard expandingCardProps={expandingCardProps} instantOpenOnClick={true}>
            <div className={classNames.item}>{item.label}</div>
          </HoverCard>
        );
      }
      return item[column.key as keyof any];
    };

    const onRenderItemColumnPicklist2 = (item: IPicklistItem, index: number, column: IColumn): JSX.Element | React.ReactText => {
      const expandingCardProps: IExpandingCardProps = {
        onRenderCompactCard: onRenderCompactCard,
        onRenderExpandedCard: onRenderExpandedCardPicklist2,
        renderData: item,
      };
      if (column.key === 'Subcategory') {
        return (
          <HoverCard expandingCardProps={expandingCardProps} instantOpenOnClick={true}>
            <div className={classNames.item}>{item.label}</div>
          </HoverCard>
        );
      }
      return item[column.key as keyof any];
    };          

    const handleSetSelectedRows = (functionarguments:any) => {
        
        let cdata1Original = storedata.dataOriginal;

        let picklist2ShowValues:Array<number> = new Array<number>();
        selectionPicklist1.getSelection().forEach((selectedItem:any) => {
          
          mapping_config.mappings.forEach((mappingItem:IMapping)=>{
            if(mappingItem.field1value==parseInt(selectedItem.value)) {
              picklist2ShowValues = picklist2ShowValues.concat(mappingItem.field2values);
            }
          });
          
          if(picklist2ShowValues.length>0) {
            //let newFilteredValues = picklist2items.data.filter((item:IPicklistItem) => {
            let newFilteredValues = cdata1Original.filter((item:IPicklistItem) => {

              if(picklist2ShowValues.indexOf(parseInt(item.value))>-1) {
                return true;
              }

              return false;

            });

            if(newFilteredValues.length>0) {
              setPicklist2itemsFiltered({"data":newFilteredValues});
              dispatch({ type: "CUSTOMDATA/SETDATA_FILTERED", data1: newFilteredValues });
            }
            else {
              setPicklist2itemsFiltered({"data":picklist2items.data});
              dispatch({ type: "CUSTOMDATA/SETDATA_FILTERED", data1: picklist2items.data });
            }
          }
          else {
            setPicklist2itemsFiltered({"data":picklist2items.data});
            dispatch({ type: "CUSTOMDATA/SETDATA_FILTERED", data1: picklist2items.data });
          }
        });
    };

    const selectionPicklist1 = new Selection({
      onSelectionChanged: () => {
        handleSetSelectedRows(arguments);
      },
    });

    //-------
    //Styles
    //-------
    const getStylesLeftPicklist = () => {
        return {
            root: {
                width: '200px',
                display:'block',
                float:'left',
                "overflow-x":'hidden',
                "overflow-y":'auto'
            }
        }
    };

    const getStylesRightPicklist = () => {
        return {
            root: {
                width: '200px',
                display:'flex',
                "overflow-x":'hidden',
                "overflow-y":'auto'
            }
        }
    };    

    return (
       <div>
        <ThemeProvider>
           <DetailsList styles={getStylesLeftPicklist} setKey="picklist1Set" items={itemsPicklist1} columns={columnsPicklist1} selection={selectionPicklist1} onRenderItemColumn={onRenderItemColumnPicklist1} />
           <DetailsList styles={getStylesRightPicklist} setKey="picklist2Set" items={storedata.dataFiltered} columns={columnsPicklist2} onRenderItemColumn={onRenderItemColumnPicklist2} />
        </ThemeProvider>


        {/*
        <ComboBox
          componentRef={comboBoxRef}
          defaultSelectedKey="C"
          label="Basic single-select ComboBox"
          options={options}
          styles={comboBoxStyles}
        />
        <PrimaryButton text="Open first ComboBox" onClick={onOpenClick} styles={buttonStyles} />
        <ComboBox
          defaultSelectedKey="C"
          label="Basic multi-select ComboBox"
          multiSelect
          options={options}
          styles={comboBoxStyles}
        />
        <ComboBox
          defaultSelectedKey="C"
          label="Basic multi-select ComboBox"
          multiSelect
          options={options}
          styles={comboBoxStyles}
        />
        */}

        
      </div>        
    );
}

export function Render(context:any, container:any, theobj:object) {
    ReactDOM.render(
      <Provider store={reduxStore}>
        <div><MultiSelectDependentPicklistControl context={context} theobj={theobj} /></div>
      </Provider>
      , container
    );
}

