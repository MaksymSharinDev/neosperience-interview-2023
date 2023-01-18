import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { CheckBox, DataTable } from 'grommet';

import { Add } from "grommet-icons"
import { randomUUID } from 'crypto';

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
    const [checked, setChecked] = useState([] as string[]);

    const list = useMemo(() => (data || {
        "id": "list-uuid-1",
        "name": "My list name",
        "items": [
            { "id": "uuid-1", label: "item 1", value: true },
            { "id": "uuid-2", label: "item 1", value: false },
            { "id": "uuid-3", label: "item 1", value: true }
        ]
    }), [data])

    useEffect(() => {
        setChecked([...list.items.filter(obj => obj.value === true).map(obj => obj.id)])
    }, [list])

    const onCheck = useCallback(
        (event: ChangeEvent<HTMLInputElement>, value: string) => {
            if (Boolean(event.target.checked)) {
                setChecked([...checked, value]);
            } else {
                setChecked(checked.filter((item) => item !== value));
            }
        }, [checked])


    const onCheckAll = useCallback(
        (event: ChangeEvent<HTMLInputElement>) =>
            (setChecked(event.target.checked ? list.items.map((obj) => obj.id) : []))
        , [list.items])


    return (
        <DataTable
            columns={[
                {
                    property: "checkbox",
                    render: ({ id, label, value }) => (
                        <CheckBox
                            key={id}
                            checked={checked.indexOf(id) !== -1}
                            onChange={(e) => { onCheck(e, id) }}
                        />
                    ),
                    header: (
                        <CheckBox
                            checked={checked.length === list.items.length}
                            indeterminate={
                                checked.length > 0 && checked.length < list.items.length
                            }
                            onChange={onCheckAll}
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