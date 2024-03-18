import ReactDOM from 'react-dom/client'
import Editor from './Editor'
import React from 'react'

export default function main() {
    ReactDOM.createRoot(document.querySelector('#root')!).render(
        React.createElement(Editor)
    )
}

main()
