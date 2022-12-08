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

function extractLawNames(xml: Document): LawNameInfo[] {
  const lawIDs = xml.getElementsByTagName('LawId');
  const lawNames = xml.getElementsByTagName('LawName');
  const lawNos = xml.getElementsByTagName('LawNo');
  const promulgationDates = xml.getElementsByTagName('PromulgationDate');

  let elementss: Element[][] = [
    Array.from(lawIDs), 
    Array.from(lawNames), 
    Array.from(lawNos), 
    Array.from(promulgationDates),
  ];

  let zipElementss = elementss[0].map((_, i) => elementss.map(elements => elements[i]));
  const tagNames = ['lawId', 'lawName', 'lawNo', 'promulgationDate', ];

  let objZipLawNameInfos: LawNameInfo[] = zipElementss.map((elements) => {
    return elements.reduce((obj, item, index) => {
      const key: string = tagNames[index];
      obj[key as keyof LawNameInfo] = item.textContent ?? '';
      return obj;
    }, {} as LawNameInfo);
  });
  return objZipLawNameInfos;
  
  // let lawNameInfos: LawNameInfo[] = [];
  // for(let i = 0; i < lawIDs.length; i++){
  //   lawNameInfos.push(
  //     {
  //       lawId: lawIDs[i].textContent ?? '',
  //       lawName: lawNames[i].textContent ?? '',
  //       lawNo: lawNos[i].textContent ?? '',
  //       promulgationDate: promulgationDates[i].textContent ?? '',
  //     }
  //   );
  // }
  // return lawNameInfos;
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
          const domPaser = new DOMParser();
          return domPaser.parseFromString(text,'text/xml');
          // const options = { ignoreComment: true, alwaysChildren: true };
          // return convert.xml2json(text, options);
        })
        // .then(json =>{
        .then(xml =>{
          return extractLawNames(xml);
          // const lawName = xml.getElementsByTagName('LawName')[0].textContent;
          // console.log(lawName);
            // return extractLanNames(json);
        })
        .then(lawNameInfos => {
           setLawNameInfos(lawNameInfos);
           console.log(lawNameInfos.length);
        })
        .catch(err => {
          console.error(err);
        });
      }
    }, []);
  
    return lawNameInfos;
  }