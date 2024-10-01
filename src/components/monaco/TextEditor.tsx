import { MeshComponent } from '@/components/objects/mesh/meshComponent'

export default function openTextEditor(object: MeshComponent) {
    const popup = window.open('', 'popupWindow', 'width=800,height=600')

    if (!popup) {
        alert(
            'ポップアップがブロックされました。ポップアップを許可してください。'
        )
        return
    }

    popup.document.write(html)
    const vertexJSON = { type: 'vertex', value: object.vertexShader }
    const fragmentJSON = { type: 'fragment', value: object.fragmentShader }

    window.addEventListener('message', (event) => {
        if (event.data.type === 'opened') {
            popup.postMessage(vertexJSON, '*')
            popup.postMessage(fragmentJSON, '*')
        } else if (event.data.type === 'vertex') {
            console.log(event.data.value)
            object.editVertexShader(event.data.value)
        } else if (event.data.type === 'fragment') {
            console.log(event.data.value)
            object.editFragmentShader(event.data.value)
        }
    })
}

const html = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1.0" name="viewport">
        <title>Monaco Editor 縦に2つ表示</title>
        <style>
            /* エディタのコンテナのスタイル */
            #container1, #container2 {
                width: 100%;
                height: 50vh; /* それぞれの高さを50%に */
                border: 1px solid #ddd;
                box-sizing: border-box;
            }
    
            /* エディタ全体のレイアウト */
            .editor-wrapper {
                display: flex;
                flex-direction: column;
                height: 100vh;
                margin: 0;
            }
        </style>
    </head>
        <body>
            <div class="editor-wrapper">
                <div id="container1"></div>
                <div id="container2"></div>
            </div>
            
            <!-- Monaco Editor の CDN -->
            <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/loader.min.js"></script>
            <script>
                // Monaco Editor をロードする
                require.config({paths: {'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs'}});
                require(['vs/editor/editor.main'], function () {
                    // 1つ目のエディタ
                    const vertexEditor = monaco.editor.create(document.getElementById('container1'), {
                        value: '// ここにコードを入力...',
                        language: 'javascript',
                        theme: 'vs-dark',
                        automaticLayout: true
                    });
            
                    // 2つ目のエディタ
                    const fragmentEditor = monaco.editor.create(document.getElementById('container2'), {
                        value: '// ここに別のコードを入力...',
                        language: 'javascript',
                        theme: 'vs-dark',
                        automaticLayout: true
                    });
            
                    window.addEventListener('message', (event) => {
                        console.log(event)
                        if (event.data.type === 'vertex') {
                            vertexEditor.setValue(event.data.value);
                        } else if (event.data.type === 'fragment') {
                            fragmentEditor.setValue(event.data.value);
                        }
                    });
                    
                    document.addEventListener('keydown', function (event) {
                      // Mac の場合は Meta キー (Cmd)、Windows/Linux は Ctrl キー
                      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
                      const isCmdOrCtrlPressed = isMac ? event.metaKey : event.ctrlKey;
                
                      if (isCmdOrCtrlPressed && event.key === 's') {
                        event.preventDefault();
                        window.opener.postMessage({type:"vertex", value: vertexEditor.getValue()}, '*')
                        window.opener.postMessage({type:"fragment", value: fragmentEditor.getValue()}, '*')
                      }
                    });
                    
                    window.opener.postMessage({type:"opened"}, '*')
                });
            </script>
        </body>
    </html>
`
