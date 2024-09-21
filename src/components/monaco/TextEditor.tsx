import {useEffect} from "react";
import ReactDOM from "react-dom/client";
import * as monaco from "monaco-editor";

export default function openTextEditor(vertexShader: string, fragmentShader: string) {
    const popup = window.open(
        '',  // 空のウィンドウ
        'popupWindow',  // ウィンドウの名前
        'width=600,height=400'  // ウィンドウサイズなどのオプション
    );

    // ポップアップにReact用のベースのdiv要素を追加
    popup.document.write('<div id="react-popup-root"></div>');
    popup.document.write('<div id="container"></div>');

    // CSSやメタデータの必要があれば、ヘッダーに追加
    const styleElement = popup.document.createElement('style');
    styleElement.textContent = '.container { width: 100%; height: 100%; }';
    popup.document.head.appendChild(styleElement);

    const popupRoot = popup.document.getElementById('react-popup-root');
    const popupContainer = popup.document.getElementById('container');

    ReactDOM.createRoot(popupRoot).render(
        <TextEditor popupContainer={popupContainer}/>
    );
}

function TextEditor({popupContainer}:{popupContainer: HTMLElement}) {
    useEffect(() => {
        monaco.editor.create(popupContainer,{
            value: [
                'function x() {',
                '\tconsole.log("Hello world!");',
                '}'
            ].join('\n'),
            language: 'javascript'
        })
    }, []);
    return <></>
}
