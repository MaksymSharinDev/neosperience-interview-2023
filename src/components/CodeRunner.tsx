import ReactCodeMirror from '@uiw/react-codemirror';
import { githubDark } from '@uiw/codemirror-theme-github';
import { javascript } from "@codemirror/lang-javascript"
//@ts-ignore
import parserBabel from "prettier/esm/parser-babel.mjs"
import prettier from "prettier"

const getBody = (str: string) => {
    let strArr = str.substring(
        str.indexOf("{") + 1,
        str.lastIndexOf("}")
    ).split('\n')
    strArr.pop(); strArr.shift()
    return strArr.join("\n")
}

type CodeRunnerProps = {
    functionToDisplay: Function
}

const CodeRunner = ({ functionToDisplay }: CodeRunnerProps) => {
    const code = getBody(
        prettier.format(
            functionToDisplay.toString(),
            {
                parser: "babel-ts",
                plugins: [parserBabel],
                printWidth: 40
            }
        )
    )

    functionToDisplay.toString()
    return (
        <ReactCodeMirror
            value={code}
            height={"360px"}
            maxWidth={"720px"}
            style={{ fontSize: 18 }}
            extensions={[javascript({ typescript: true })]}
            theme={githubDark}
            onPlay={() => { }}
        />
    )
}
export { CodeRunner }