import React, { useEffect, useState } from 'react';
import { LawNameInfo } from './LawNameInfo';
import { useLawNameInfo } from './useLawNameInfo';
import logo from './logo.svg';
import './App.css';

const APP_KEY = "smart-company";


const App = () =>  {
  const [ lawNameInfos, setLawNameInfos ] = useState([] as LawNameInfo[]);
  const lawNames = useLawNameInfo(1, 2);

  useEffect(() => {
    const storeLawNameInfos = localStorage.getItem(APP_KEY);
    if(storeLawNameInfos){
      setLawNameInfos(JSON.parse(storeLawNameInfos));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(APP_KEY, JSON.stringify(lawNameInfos));
  }, [lawNameInfos]);

  return (
    <div className="App">
      {lawNames.map((value, key) =>
          <tr key={key}>
              <th>{value.lawId}</th>
              <td>{value.lawNo}</td>
              <td>{value.lawName}</td>
              <td>{value.promulgationDate}</td>
          </tr>
      )}
    </div>
  );
}

export default App;
