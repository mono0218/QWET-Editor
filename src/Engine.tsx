import ObjectSelector from "./components/objectSelector.tsx";
import ObjectSettingMenu from "./components/objectSettingMenu.tsx";
import './global.css';

export default function Engine() {
  return (
      <div className="flex justify-between">
          <ObjectSelector />
          <ObjectSettingMenu />
      </div>
  )
}