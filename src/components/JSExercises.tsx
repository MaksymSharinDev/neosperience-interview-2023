import { CodeRunner } from './CodeRunner';
import { useMemo } from 'react';

type JSExercisesProps = { exNumber: number }
const JSExercises = ({ exNumber }: JSExercisesProps) => {
    const exArray = useMemo(() => [
        function Ex1() {
            const uppercase = (str: string) =>
                str.split('')
                    .map((char: string) => char.toUpperCase())
                    .join("")
            console.log(uppercase("ciao"))
        },

        function Ex2() {
            const swapCase = (str: string) =>
                str.split(' ')
                    .map((word: string, i: number) =>
                        i + 1 % 2 === 0 ? word : word.toUpperCase())
                    .join(' ')
            console.log(swapCase("Ciao come stai"))
        },

        function Ex3() {
            const shiftLetters = (str: string) =>
                str.split('')
                    .map((char: string) =>
                        String.fromCharCode((char.charCodeAt(0) - 1)))
                    .join("")
            console.log(shiftLetters("hello"))
        },
        function Ex4() {
            const countedChars = (str: string) =>
                str.split("").reduce((obj, cur, i) => {
                    obj[cur] = i; return obj;
                }, {} as {
                    [key: string]: number
                })
            console.log(countedChars("ciao"))
        },
        function Ex5() {
            const isPresent = (str: string, target: string) =>
                str.split('')
                    .find(v => v === target) !== undefined
            console.log(isPresent("ciao", 'c'))
            console.log(isPresent("ciao", 'v'))
        }
    ], [])

    return (
        <>
            <CodeRunner functionToDisplay={exArray[exNumber - 1]} />
        </>
    )
}

export { JSExercises }