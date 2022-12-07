import { useState, useEffect } from "react";
import { LawNameInfo } from "./LawNameInfo";
import convert from 'xml-js';

function buildSearchUrl(version: number, lawType: number): string {
    let url = `https://elaws.e-gov.go.jp/api/${version}/lawlists/${lawType} `;
    return url;
  }

function extractLanNames(jsonText: any): LawNameInfo[] {
    const json = JSON.parse(jsonText);
    const obj: any = json.elements[0].elements[1];
    // console.log(obj.elements[0]);
    // console.log(obj.elements[1].elements[0].elements[0].text);
    // console.log(obj.elements[1].elements[1].elements[0].text);
    // console.log(obj.elements[1].elements[2].elements[0].text);
    // console.log(obj.elements[1].elements[3].elements[0].text);
    // console.log(obj.elements[2].elements[0].elements[0].text);
    // console.log(obj.elements[2].elements[1].elements[0].text);
    // console.log(obj.elements[2].elements[2].elements[0].text);
    // console.log(obj.elements[2].elements[3].elements[0].text);


    return obj.elements.flatMap((item: any) => {
        if(item.name === "LawNameListInfo"){
            return {
                lawId: item.elements[0].elements[0].text,
                lawName: item.elements[1].elements[0].text,
                lawNo: item.elements[2].elements[0].text,
                promulgationDate: item.elements[3].elements[0].text,
            }
        }
        return [];
    });
}

export const useLawNameInfo = (version: number, lawType: number) => {
    const [ lawNameInfos, setLawNameInfos ] = useState([] as LawNameInfo[]);
  
    useEffect(() => {
      if( version || lawType ){
        console.log('useLawNameInfo.useEffect');
        const url = buildSearchUrl(version, lawType);
        fetch(url)
        .then(respone => {
          return respone.text();
        })
        .then(text => {
          const options = { ignoreComment: true, alwaysChildren: true };
          return convert.xml2json(text, options);
        })
        .then(json =>{
            return extractLanNames(json);
        })
        .then(lawNameInfos => {
          setLawNameInfos(lawNameInfos);
        })
        .catch(err => {
          console.error(err);
        });
      }
    }, []);
  
    return lawNameInfos;
  }