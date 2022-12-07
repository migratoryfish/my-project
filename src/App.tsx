import React, { useEffect, useState } from 'react';
import { LawNameInfo } from './LawNameInfo';
import logo from './logo.svg';
import './App.css';

const APP_KEY = "smart-company";

const App = () =>  {
  const [ lawNameInfos, setLawNameInfos ] = useState([] as LawNameInfo[]);

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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
      </header>
    </div>
  );
}

export default App;
