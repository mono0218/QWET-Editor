import React, {useEffect} from 'react';
import ObjectSelector from "./components/objectSelector";
import ObjectSettingMenu from "./components/objectSettingMenu";
import Engine from "./lib/LiveEngine";
import './global.css';

export default function Editor() {
    useEffect(() => {
        Engine()
    }, []);
    return (
      <div className="flex">
        <ObjectSelector />
        <canvas className="w-full"></canvas>
        <ObjectSettingMenu />
      </div>
    )
}