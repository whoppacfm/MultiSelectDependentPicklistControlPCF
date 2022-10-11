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

//-------------------------
//Data Definitions
//-------------------------
class CCustomData {
    customdata1:string;
    customdata2:string;
    constructor(customdata1?:string, customdata2?:string) {
        if(customdata1) {
            this.customdata1 = customdata1;
        }
        if(customdata2) {
            this.customdata2 = customdata2;
        }
    };
}

//UI Stuff
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




//-------------------------
//Redux
//-------------------------
function reducerCustomData(customdata:CCustomData[] = new Array<CCustomData>(), action:AnyAction) {
    switch (action.type) {
        case "CUSTOMDATA/SETCUSTOMDATA":
            return {
                customdata: action.data1
            }
        default:
        return customdata;
    }
}

//const reduxStore = createStore(reducerCustomData as any);
const reduxStore = configureStore({ reducer: reducerCustomData });

//Save data to store
//dispatch({ type: "CUSTOMDATA/SETCUSTOMDATA", data1: data });

//Get data from store
//let customdata = useSelector((customdata: CCustomData[]) => customdata);
//let cdata1 = customdata.customdata1;


function MultiSelectDependentPicklistControl(props:any) {

    //-------------------------
    //UI Stuff
    //-------------------------
    const comboBoxRef = React.useRef<IComboBox>(null);
    const onOpenClick = React.useCallback(() => comboBoxRef.current?.focus(true), []);

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
      
      interface IExampleItem {
        label:string;
        value:string;
      }

      const items: IExampleItem[] = [{"label":"123", "value":"fsdfdsf"},{"label":"543", "value":"fdss"},{"label":"3456", "value":"xcvx"}]; //createListItems(10);
      
      const buildColumn = (): IColumn[] => {
        return buildColumns(items).filter(column => column.name === 'label');
      };
      
      const onRenderCompactCard = (item: IExampleItem): JSX.Element => {
        return (
          <div className={classNames.compactCard}>
            <a target="_blank" href={`http://wikipedia.org/wiki/${item.label}`}>
              {item.label}
            </a>
          </div>
        );
      };
      
      const columns: IColumn[] = buildColumn();
      
      const onRenderExpandedCard = (item: IExampleItem): JSX.Element => {
        return (
          <div className={classNames.expandedCard}>
            {item.label}
            <DetailsList setKey="expandedCardSet" items={items} columns={columns} />
          </div>
        );
      };
      
      const onRenderItemColumn = (item: IExampleItem, index: number, column: IColumn): JSX.Element | React.ReactText => {
        const expandingCardProps: IExpandingCardProps = {
          onRenderCompactCard: onRenderCompactCard,
          onRenderExpandedCard: onRenderExpandedCard,
          renderData: item,
        };
        if (column.key === 'label') {
          return (
            <HoverCard expandingCardProps={expandingCardProps} instantOpenOnClick={true}>
              <div className={classNames.item}>{item.label}</div>
            </HoverCard>
          );
        }
        return item[column.key as keyof IExampleItem];
      };

    //-------------------------
    //State
    //-------------------------
    /*
    const [customState, setCustomState] = React.useState({ 
        statevar1: "",
        statevar2: ""
    });
    */

    //-------------------------
    //Init
    //-------------------------

    //Get current record data
    let currentFntityId = (props.context.mode as any).contextInfo.entityId;
    let currentEntityTypeName = (props.context.mode as any).contextInfo.entityTypeName;
    let currentEntityRecordName = (props.context.mode as any).contextInfo.entityRecordName;

    //Get current control field values

    //Lookup Field Example
    //let lookupfield_currentValue = props.context.parameters.BoundLookupField.raw[0];
    //let lookupfield_currentId = lookupfield_currentValue.id;
    //let lookupfield_currentEntityType = lookupfield_currentValue.entityType;
    //let lookupfield_currentRecordName = lookupfield_currentValue.name;

    //Datetime Example
    //let dateval = context.parameters.date_input_property.raw?.toDateString();

    //Get PCF Config
    /*
    let config_fields:Array<string> = [];
    let config_lists:string = "";

    if(props.context.parameters.Fields.raw!=null) {
        config_fields = props.context.parameters?.Fields?.raw.split(",");
    }

    if(props.context.parameters?.Lists?.raw!=null) {
        config_lists = props.context.parameters?.Lists?.raw;
    }
    */
    
    //Init Dispatch
    const dispatch = useDispatch();
    
    //Init data / load data
    useEffect(() => {

        if(DATA_SOURCE=="TEST") {
            
            //Init test data
            /*
            setCustomState({"statevar1": "test123", "statevar2":"test123"});

            const testData:CCustomData[] = [
                {"customdata1":"1","customdata2":"test1"},
                {"customdata1":"2","customdata2":"test2"},
                {"customdata1":"3","customdata2":"test3"}
            ]
            
            dispatch({ type: "CUSTOMDATA/SETCUSTOMDATA", data1: testData });
            */
        }
        else {

            //Load data from crm

        }

    }, []);

    //Get data from store
    let storeData1 = useSelector((customdata: any) => customdata);
    let showStoredata:any;
    if(storeData1!=null && storeData1.customdata!=null && storeData1.customdata.length>0) {
        showStoredata = (storeData1.customdata as Array<CCustomData>).map((item:CCustomData) => {
            return (
                <>
                    <div>{item.customdata1}</div><div>{item.customdata2}</div>
                    <br/><br/>
                </>
            );
        });
    }
    
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
           <DetailsList styles={getStylesLeftPicklist} setKey="hoverSet" items={items} columns={columns} onRenderItemColumn={onRenderItemColumn} />
           <DetailsList styles={getStylesRightPicklist} setKey="hoverSet" items={items} columns={columns} onRenderItemColumn={onRenderItemColumn} />
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

