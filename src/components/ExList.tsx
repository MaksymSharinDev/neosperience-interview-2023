import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { CheckBox, DataTable, Text } from 'grommet';

//@ts-ignore


type ExListProps = {
    data?: {
        id: string,
        name: string,
        items: {
            id: string,
            label: string,
            value: boolean
        }[]
    } | undefined
}
const ExList = ({ data } = { data: undefined } as ExListProps) => {

    const list = useMemo(() => (data || {
        "id": "list-uuid-1",
        "name": "My list name",
        "items": [
            { "id": "uuid-1", label: "item 1", value: true },
            { "id": "uuid-2", label: "item 1", value: false },
            { "id": "uuid-3", label: "item 1", value: true }
        ]
    }), [data])

    const [checked, setChecked] = useState([] as string[]);
    const [done, setDone] = useState([] as string[])
    useEffect(() => {
        setChecked([...list.items.filter(obj => obj.value === true).map(obj => obj.id)])
    }, [])

    const onCheck = useCallback(
        (checkedStutus: boolean, value: string) => {
            if (done.includes(value)) return
            if (checkedStutus) {
                setChecked([...checked, value]);
            } else {
                setChecked(checked.filter((item) => item !== value));
            }
        }, [checked, done])

    const onCheckAll =
        (event: ChangeEvent<HTMLInputElement>) => {
            console.log(event.target.checked)
            const ids = list.items.map((obj) => obj.id)
            if (event.target.checked) {
                setChecked(
                    ids.filter(id => !(done.includes(id) && !checked.includes(id))))
            } else {
                // save done checked
                setChecked(ids.filter(id => done.includes(id) && checked.includes(id)))
            }

        }


    const onDone = useCallback(
        (event: ChangeEvent<HTMLInputElement>, value: string) => {
            if (Boolean(event.target.checked)) {
                setDone([...done, value]);
            } else {
                setDone(done.filter((item) => item !== value));
            }
        }, [done])



    return (
        <DataTable
            columns={[
                {
                    property: "id",
                    size: "20%"
                },
                {
                    property: "checkbox",
                    size: "5%",
                    render: ({ id }) => (
                        <CheckBox
                            key={id}
                            checked={checked.indexOf(id) !== -1}
                            onChange={(e) => { onCheck(e.target.checked, id) }}
                        />
                    ),
                    header: (
                        <CheckBox
                            checked={checked.length >= list.items.length - done.length }
                            onChange={onCheckAll}
                        />
                    ),
                    sortable: false,
                },
                {
                    property: "label",
                    render: ({ id, label }) =>
                        done.includes(id) ?
                            (<Text color={"green"}>{label}</Text>) :
                            (<Text>{label}</Text>)
                },
                {
                    property: "done",
                    size: "5%",
                    render: ({ id }) => (
                        <CheckBox
                            key={id}
                            checked={done.indexOf(id) !== -1}
                            onChange={(e) => { onDone(e, id) }}
                        />
                    ),
                    sortable: false,
                },
            ]}
            data={list.items}
        />
    )
}
export { ExList }